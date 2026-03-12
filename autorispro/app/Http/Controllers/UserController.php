<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * GET /api/equipe
     * Manager — liste les membres de son équipe
     */
    public function monEquipe()
    {
        $equipe = User::where('manager_id', Auth::id())
            ->where('role', 'user')
            ->withCount([
                'demandes',
                'demandes as demandes_en_attente_count' => fn($q) => $q->where('status', 'en_attente'),
                'demandes as demandes_acceptees_count'  => fn($q) => $q->where('status', 'acceptee'),
            ])
            ->get();

        return response()->json($equipe);
    }

    // ─── ADMIN CRUD ──────────────────────────────

    /**
     * GET /api/users
     */
    public function index()
    {
        $users = User::withCount('demandes')->get();
        return response()->json($users);
    }

    /**
     * POST /api/users
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:100',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|string|min:6',
            'role'       => 'required|in:user,manager,admin',
            'department' => 'required|string|max:100',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
            'department' => $request->department,
            'manager_id' => $request->manager_id,
            'avatar'     => strtoupper(substr($request->name, 0, 1) . (strpos($request->name, ' ') !== false ? substr(strrchr($request->name, ' '), 1, 1) : '')),
            'status'     => 'actif',
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user'    => $user,
        ], 201);
    }

    /**
     * GET /api/users/{id}
     */
    public function show($id)
    {
        $user = User::withCount('demandes')->findOrFail($id);
        return response()->json($user);
    }

    /**
     * PUT /api/users/{id}
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'       => 'sometimes|string|max:100',
            'email'      => 'sometimes|email|unique:users,email,' . $id,
            'role'       => 'sometimes|in:user,manager,admin',
            'department' => 'sometimes|string|max:100',
            'status'     => 'sometimes|in:actif,inactif',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        $user->update($request->only(['name', 'email', 'role', 'department', 'status', 'manager_id']));

        return response()->json([
            'message' => 'Utilisateur mis à jour.',
            'user'    => $user->fresh(),
        ]);
    }

    /**
     * DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }
}
