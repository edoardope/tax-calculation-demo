<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use GuzzleHttp\Client;

class ProductController extends Controller
{

    public function index(Request $request)
    {
        $products = Product::query();

        if ($request->has('search')) {
            $searchTerm = strtolower($request->input('search'));
            $products->where('name', 'like', "%{$searchTerm}%");
        }

        if ($request->has('category')) {
            $products->where('category', $request->input('category'));
        }

        if ($request->has('min_price')) {
            $products->where('price', '>=', $request->input('min_price'));
        }

        if ($request->has('max_price')) {
            $products->where('price', '<=', $request->input('max_price'));
        }

        return response()->json($products->get());
    }

    public function calculateTaxes(Request $request)
    {
        // Verifica del token reCAPTCHA
        $recaptchaToken = $request->input('recaptcha_token');
        $response = $this->validateRecaptcha($recaptchaToken);

        if (!$response['success']) {
            return response()->json(['error' => 'Invalid reCAPTCHA token'], 400);
        }

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

    public function addImported(Request $request)
    {
        $itemId = $request->input('itemid');
        $product = Product::find($itemId);

        if ($product) {
            $product->imported = !$product->imported; 
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Stato imported aggiornato',
                'imported' => $product->imported,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Prodotto non trovato'], 404);
    }


    private function validateRecaptcha($token)
    {
        $client = new Client();
        $response = $client->post('https://www.google.com/recaptcha/api/siteverify', [
            'form_params' => [
                'secret' => '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',  
                'response' => $token,
                
            ],
            'verify' => false,
        ]);

        return json_decode($response->getBody(), true);
    }
}
