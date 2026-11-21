<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'category_id',
        'brand_id',
        'supplier_id',
        'code',
        'barcode',
        'name',
        'description',
        'unit',
        'cost',
        'price',
        'price2',
        'price3',
        'price4',
        'utility_percent',
        'stock',
        'stock_min',
        'stock_max',
        'track_stock',
        'has_variants',
        'image',
        'expiration_date',
        'notes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'cost' => 'decimal:2',
            'price' => 'decimal:2',
            'price2' => 'decimal:2',
            'price3' => 'decimal:2',
            'price4' => 'decimal:2',
            'stock' => 'decimal:2',
            'stock_min' => 'decimal:2',
            'stock_max' => 'decimal:2',
            'track_stock' => 'boolean',
            'has_variants' => 'boolean',
            'is_active' => 'boolean',
            'expiration_date' => 'date',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function prices(): HasMany
    {
        return $this->hasMany(ProductPrice::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }
}
