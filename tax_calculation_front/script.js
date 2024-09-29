document.addEventListener('DOMContentLoaded', function () {
    let products = [];
    let selectedItems = [];

    function fetchProducts(search = '', category = '', minPrice = '', maxPrice = '') {
        let url = 'http://localhost:8000/api/products';

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        console.log('Fetching products with URL:', url);  

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);  
                products = data;
                displayProducts();
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts() {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = '';  
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <span class="category-label">${product.category.toUpperCase()}</span>
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <label>
                    <input type="checkbox" ${product.imported ? 'checked' : ''} onchange="toggleImported(${product.id})">
                    Apply import duty
                </label>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productGrid.appendChild(productDiv);
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
        const selectedProductsTable = document.getElementById('selected-products');
        selectedProductsTable.innerHTML = '';  
        selectedItems.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.imported ? 'Yes' : 'No'}</td>
                <td>$${product.price}</td>
                <td>$${product.tax || 0.00}</td>
                <td><span class="delete-btn" onclick="removeFromCart(${product.id})">🗑️</span></td>
            `;
            selectedProductsTable.appendChild(row);
        });
    }

    document.getElementById('generate-receipt').addEventListener('click', function () {
        const selectedItemIds = selectedItems.map(item => item.id);

        fetch('http://localhost:8000/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemid: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchProducts();  
            }
        })
        .catch(error => console.error('Error toggling imported status:', error));
    };

    document.getElementById('apply-filters').addEventListener('click', function () {
        const search = document.getElementById('search').value;
        const category = document.getElementById('category').value;
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;

        console.log(`Search: ${search}, Category: ${category}, Min Price: ${minPrice}, Max Price: ${maxPrice}`);
        fetchProducts(search, category, minPrice, maxPrice);  
    });

    fetchProducts();
});
