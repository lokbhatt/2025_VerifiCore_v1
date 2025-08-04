<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear cached roles/permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // defin guard
        $guard = 'web';

        // define permissions
        $memberPermissions = [
            'register',
            'login',
            'fillup kyc',
            'modify kyc',
            'delete kyc',
            'logout',
        ];

        $adminPermissions = [
            'approve member',
            'approve kyc'
        ];

        // merge all unique permission
        $permissions = array_unique([...$memberPermissions, ...$adminPermissions]);

        // create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => $guard
            ]);
        }

        // create roles 
        $memberRole = Role::firstOrCreate([
            'name' => 'member',
            'guard_name' => $guard
        ]);

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => $guard
        ]);

        $staffRole = Role::firstOrCreate([
            'name' => 'staff',
            'guard_name' => $guard
        ]);

        // Assign Permission to  Roles
        $memberRole->givePermissionTo($memberPermissions);
        $adminRole->givePermissionTo($adminPermissions);
    }
}
