<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Demande;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ────────────────────────────────────
        $admin = User::create([
            'name'       => 'Nadia El Amrani',
            'email'      => 'n.elamrani@ofppt.ma',
            'password'   => Hash::make('admin123'),
            'role'       => 'admin',
            'department' => 'RH',
            'avatar'     => 'NA',
            'status'     => 'actif',
        ]);

        // ── Manager ──────────────────────────────────
        $manager = User::create([
            'name'       => 'Karim Mansouri',
            'email'      => 'k.mansouri@ofppt.ma',
            'password'   => Hash::make('manager123'),
            'role'       => 'manager',
            'department' => 'Informatique',
            'avatar'     => 'KM',
            'status'     => 'actif',
        ]);

        // ── Utilisateurs ─────────────────────────────
        $youssef = User::create([
            'name'       => 'Youssef Benali',
            'email'      => 'y.benali@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Informatique',
            'avatar'     => 'YB',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        $fatima = User::create([
            'name'       => 'Fatima Zahra',
            'email'      => 'f.zahra@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Commerce',
            'avatar'     => 'FZ',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        $omar = User::create([
            'name'       => 'Omar Tazi',
            'email'      => 'o.tazi@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Électronique',
            'avatar'     => 'OT',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        $sara = User::create([
            'name'       => 'Sara Idrissi',
            'email'      => 's.idrissi@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Informatique',
            'avatar'     => 'SI',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        // ── Demandes de test ──────────────────────────
        Demande::insert([
            [
                'user_id'    => $youssef->id,
                'manager_id' => $manager->id,
                'type'       => 'absence',
                'reason'     => 'Rendez-vous médical urgent',
                'start_date' => '2025-03-15',
                'end_date'   => '2025-03-15',
                'status'     => 'en_attente',
                'comment'    => null,
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'user_id'    => $fatima->id,
                'manager_id' => $manager->id,
                'type'       => 'conge',
                'reason'     => 'Congé annuel planifié',
                'start_date' => '2025-03-20',
                'end_date'   => '2025-03-27',
                'status'     => 'acceptee',
                'comment'    => 'Accordé. Bon repos!',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(6),
            ],
            [
                'user_id'    => $youssef->id,
                'manager_id' => $manager->id,
                'type'       => 'sortie',
                'reason'     => 'Déplacement professionnel - visite client',
                'start_date' => '2025-03-12',
                'end_date'   => '2025-03-12',
                'status'     => 'refusee',
                'comment'    => 'Déplacement non justifié pour cette période.',
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(7),
            ],
            [
                'user_id'    => $omar->id,
                'manager_id' => $manager->id,
                'type'       => 'absence',
                'reason'     => 'Formation externe React.js à Rabat',
                'start_date' => '2025-03-18',
                'end_date'   => '2025-03-19',
                'status'     => 'en_attente',
                'comment'    => null,
                'created_at' => now()->subDays(4),
                'updated_at' => now()->subDays(4),
            ],
            [
                'user_id'    => $sara->id,
                'manager_id' => $manager->id,
                'type'       => 'conge',
                'reason'     => 'Congé maternité',
                'start_date' => '2025-04-01',
                'end_date'   => '2025-06-30',
                'status'     => 'en_attente',
                'comment'    => null,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ]);
    }
}
