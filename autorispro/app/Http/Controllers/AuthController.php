<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Connexion utilisateur — retourne un token Sanctum
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        if ($user->status !== 'actif') {
            return response()->json([
                'message' => 'Compte désactivé. Contactez l\'administrateur.',
            ], 403);
        }

        // Révoquer les anciens tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'department' => $user->department,
                'avatar'     => $user->avatar,
                'status'     => $user->status,
                'manager_id' => $user->manager_id,
            ],
        ], 200);
    }

    /**
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    /**
     * GET /api/me
     * Retourne l'utilisateur connecté
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
