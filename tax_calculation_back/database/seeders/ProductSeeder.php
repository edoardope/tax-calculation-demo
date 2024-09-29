<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        
        $response = Http::get('https://instilla-sales-tax-problem.s3.eu-central-1.amazonaws.com/sales-tax-problem-test.json');
        $products = $response->json();  

        foreach ($products as $productData) {
            Product::create([
                'name' => $productData['name'],
                'price' => $productData['price'],
                'category' => $productData['category'],
                'image' => $productData['image'],
                
            ]);
        }
    }
}
