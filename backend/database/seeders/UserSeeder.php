<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'company_id' => 1,
            'name' => 'Admin Principal',
            'email' => 'admin@candacedemo.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'company_id' => 1,
            'name' => 'María Vendedora',
            'email' => 'maria@candacedemo.com',
            'password' => Hash::make('admin123'),
            'role' => 'seller',
            'is_active' => true,
        ]);

        User::create([
            'company_id' => 1,
            'name' => 'Carlos Almacén',
            'email' => 'carlos@candacedemo.com',
            'password' => Hash::make('admin123'),
            'role' => 'warehouse',
            'is_active' => true,
        ]);

        User::create([
            'company_id' => 2,
            'name' => 'Admin Moda Sport',
            'email' => 'admin@modasport.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }
}
