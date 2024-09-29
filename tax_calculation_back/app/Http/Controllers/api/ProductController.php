<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function calculateTaxes(Request $request)
    {
        $items = $request->input('items');
        $total = 0;
        $totalTax = 0;
        $receipt = [];

        foreach ($items as $itemId) {
            $product = Product::find($itemId);  

            if ($product) {
                $tax = $product->calculateTax();  
                $totalTax += $tax;
                $total += $product->price + $tax;

                $receipt[] = [
                    'name' => $product->name,
                    'price_with_tax' => round($product->price + $tax, 2),  
                ];
            }
        }

        return response()->json([
            'receipt' => $receipt,
            'total' => round($total, 2),
            'total_tax' => round($totalTax, 2),
        ]);
    }
}
