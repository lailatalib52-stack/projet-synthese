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
        // ── Admin ─────────────────────────────────
        $admin = User::create([
            'name'       => 'Mostafa Taibane',
            'email'      => 'm.taibane@ofppt.ma',
            'password'   => Hash::make('admin123'),
            'role'       => 'admin',
            'department' => 'Administration',
            'avatar'     => 'MT',
            'status'     => 'actif',
        ]);

        // ── Manager ───────────────────────────────
        $manager = User::create([
            'name'       => 'Laila Talib',
            'email'      => 'l.talib@ofppt.ma',
            'password'   => Hash::make('manager123'),
            'role'       => 'manager',
            'department' => 'Informatique',
            'avatar'     => 'LT',
            'status'     => 'actif',
        ]);

        // ── Utilisateurs ──────────────────────────
        $user1 = User::create([
            'name'       => 'Ahmed Bennani',
            'email'      => 'a.bennani@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Informatique',
            'avatar'     => 'AB',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        $user2 = User::create([
            'name'       => 'Salma Idrissi',
            'email'      => 's.idrissi@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Commerce',
            'avatar'     => 'SI',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        $user3 = User::create([
            'name'       => 'Youssef El Fassi',
            'email'      => 'y.elfassi@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Électronique',
            'avatar'     => 'YF',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        $user4 = User::create([
            'name'       => 'Nora Chaoui',
            'email'      => 'n.chaoui@ofppt.ma',
            'password'   => Hash::make('user123'),
            'role'       => 'user',
            'department' => 'Informatique',
            'avatar'     => 'NC',
            'status'     => 'actif',
            'manager_id' => $manager->id,
        ]);

        // ── Demandes de test ──────────────────────
        Demande::insert([
            ['user_id'=>$user1->id,'manager_id'=>$manager->id,'type'=>'absence','reason'=>'Rendez-vous médical urgent','start_date'=>'2025-03-15','end_date'=>'2025-03-15','status'=>'en_attente','comment'=>null,'created_at'=>now()->subDays(2),'updated_at'=>now()->subDays(2)],
            ['user_id'=>$user2->id,'manager_id'=>$manager->id,'type'=>'conge','reason'=>'Congé annuel planifié','start_date'=>'2025-03-20','end_date'=>'2025-03-27','status'=>'acceptee','comment'=>'Accordé. Bon repos!','created_at'=>now()->subDays(5),'updated_at'=>now()->subDays(4)],
            ['user_id'=>$user1->id,'manager_id'=>$manager->id,'type'=>'sortie','reason'=>'Déplacement professionnel - visite client','start_date'=>'2025-03-12','end_date'=>'2025-03-12','status'=>'refusee','comment'=>'Déplacement non justifié.','created_at'=>now()->subDays(7),'updated_at'=>now()->subDays(6)],
            ['user_id'=>$user3->id,'manager_id'=>$manager->id,'type'=>'absence','reason'=>'Formation externe Laravel à Rabat','start_date'=>'2025-03-18','end_date'=>'2025-03-19','status'=>'en_attente','comment'=>null,'created_at'=>now()->subDays(3),'updated_at'=>now()->subDays(3)],
            ['user_id'=>$user4->id,'manager_id'=>$manager->id,'type'=>'conge','reason'=>'Congé maternité','start_date'=>'2025-04-01','end_date'=>'2025-06-30','status'=>'en_attente','comment'=>null,'created_at'=>now()->subDays(1),'updated_at'=>now()->subDays(1)],
            ['user_id'=>$user2->id,'manager_id'=>$manager->id,'type'=>'sortie','reason'=>'Réunion partenaire commercial Casablanca','start_date'=>'2025-03-22','end_date'=>'2025-03-22','status'=>'en_attente','comment'=>null,'created_at'=>now()->subDays(1),'updated_at'=>now()->subDays(1)],
        ]);
    }
}