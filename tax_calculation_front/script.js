document.addEventListener('DOMContentLoaded', function () {
    let products = [];
    let selectedItems = [];

    function fetchProducts() {
        fetch('http://localhost:8000/api/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                displayProducts();
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <strong>${product.name}</strong> - $${product.price} 
                <span>Imported: ${product.imported ? 'Yes' : 'No'}</span>
                <button onclick="toggleImported(${product.id})">${product.imported ? 'Remove Imported' : 'Add Imported'}</button>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productDiv);
        });
    }

    window.addToCart = function (id) {
        const selectedProduct = products.find(product => product.id === id);
        if (!selectedItems.some(item => item.id === id)) {
            selectedItems.push(selectedProduct);  
        }
        displaySelectedProducts();
    };

    window.removeFromCart = function (id) {
        selectedItems = selectedItems.filter(item => item.id !== id);  
        displaySelectedProducts();
    };

    function displaySelectedProducts() {
        const selectedList = document.getElementById('selected-products');
        selectedList.innerHTML = '';
        selectedItems.forEach(product => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                ${product.name} - $${product.price}
                <button onclick="removeFromCart(${product.id})">Remove from Cart</button>
            `;
            selectedList.appendChild(itemDiv);
        });
    }

    document.getElementById('generate-receipt').addEventListener('click', function () {
        const selectedItemIds = selectedItems.map(item => item.id);

        fetch('http://localhost:8000/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: selectedItemIds })
        })
        .then(response => response.json())
        .then(data => {
            displayReceipt(data);
        })
        .catch(error => console.error('Error generating receipt:', error));
    });

    function displayReceipt(data) {
        const receiptDiv = document.getElementById('receipt');
        receiptDiv.innerHTML = '';  
        data.receipt.forEach(item => {
            receiptDiv.innerHTML += `<div>${item.name}: $${item.price_with_tax}</div>`;
        });
        receiptDiv.innerHTML += `<div><strong>Total:</strong> $${data.total}</div>`;
        receiptDiv.innerHTML += `<div><strong>Total Tax:</strong> $${data.total_tax}</div>`;
    }

    window.toggleImported = function (id) {
        fetch('http://localhost:8000/api/imported', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemid: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Imported status updated to: ${data.imported ? 'Yes' : 'No'}`);
                fetchProducts();  
            }
        })
        .catch(error => console.error('Error toggling imported status:', error));
    };

    fetchProducts();
});
