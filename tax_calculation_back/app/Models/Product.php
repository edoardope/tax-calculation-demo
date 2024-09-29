<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * La tabella associata al modello.
     *
     * @var string
     */
    protected $table = 'products';

    /**
     * I campi che possono essere assegnati in massa (mass assignment).
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'price',
        'category',
        'image',
    ];

    /**
     * I campi che non possono essere assegnati in massa.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Imposta il tipo di dato per i campi.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * Calcola le tasse per il prodotto.
     *
     * @return float
     */
    public function calculateTax()
    {
        $basicTaxRate = 0;
        $importTaxRate = 0;

        // Determina il tasso della tassa base in base alla categoria
        if (!in_array($this->category, ['books', 'food', 'medical-products'])) {
            $basicTaxRate = 10;  // 10% per tutte le categorie non esenti
        }

        // Import duty (5%) per i prodotti importati
        if ($this->imported) {
            $importTaxRate = 5;
        }

        // Calcola la tassa totale (arrotondata al multiplo di 0.05)
        $totalTaxRate = $basicTaxRate + $importTaxRate;
        $tax = ceil(($this->price * $totalTaxRate) / 100 / 0.05) * 0.05;

        return $tax;
    }
}
