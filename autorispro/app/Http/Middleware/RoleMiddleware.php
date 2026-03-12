<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Vérifie que l'utilisateur a le rôle requis.
     * Usage dans routes : ->middleware('role:manager')
     *
     * Un admin a accès à tout.
     */
    public function handle(Request $request, Closure $next, ...$roles): mixed
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        // L'admin a accès à toutes les routes
        if ($user->role === 'admin') {
            return $next($request);
        }

        if (! in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Accès refusé. Rôle insuffisant.',
            ], 403);
        }

        return $next($request);
    }
}
