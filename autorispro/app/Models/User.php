<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department',
        'avatar',
        'status',
        'manager_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // ── Relations ────────────────────────────────

    /** Demandes de cet utilisateur */
    public function demandes()
    {
        return $this->hasMany(Demande::class, 'user_id');
    }

    /** Manager de cet utilisateur */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /** Membres de l'équipe (si manager) */
    public function equipe()
    {
        return $this->hasMany(User::class, 'manager_id');
    }

    /** Demandes à valider (si manager) */
    public function demandesAValider()
    {
        return $this->hasMany(Demande::class, 'manager_id');
    }
}
