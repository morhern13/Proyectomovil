<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id', 'product_id', 'sku', 'barcode', 'size', 'color',
        'color_hex', 'stock', 'price_adjustment', 'is_active',
    ];

    protected function casts(): array
    {
        return ['stock' => 'decimal:2', 'price_adjustment' => 'decimal:2', 'is_active' => 'boolean'];
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
}
