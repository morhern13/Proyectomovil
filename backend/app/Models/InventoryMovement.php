<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    protected $fillable = [
        'company_id', 'product_id', 'product_variant_id', 'user_id',
        'type', 'reference_type', 'reference_id', 'reference_number',
        'quantity', 'stock_before', 'stock_after', 'unit_cost', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2', 'stock_before' => 'decimal:2',
            'stock_after' => 'decimal:2', 'unit_cost' => 'decimal:2',
        ];
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function variant(): BelongsTo { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
