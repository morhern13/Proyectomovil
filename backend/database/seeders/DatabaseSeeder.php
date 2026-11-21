<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CompanySeeder::class,
            UserSeeder::class,
            BrandSeeder::class,
            CategorySeeder::class,
            SupplierSeeder::class,
            CustomerSeeder::class,
            ProductSeeder::class,
            InvoiceSeeder::class,
        ]);

        // Assign suppliers to some products
        Product::whereIn('id', [1, 2, 3, 4])->update(['supplier_id' => 1]);
        Product::whereIn('id', [5, 6, 7])->update(['supplier_id' => 4]);
        Product::whereIn('id', [11, 12, 13, 14])->update(['supplier_id' => 2]);
        Product::whereIn('id', [15, 16, 17])->update(['supplier_id' => 5]);
        Product::whereIn('id', [20, 21])->update(['supplier_id' => 5]);
        Product::whereIn('id', [22, 23])->update(['supplier_id' => 3]);
    }
}
