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
}
