<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StatController extends Controller
{
    /**
     * GET /api/stats
     * Statistiques globales pour l'administrateur
     */
    public function index()
    {
        // ── Totaux généraux ──────────────────────────
        $totalDemandes  = Demande::count();
        $totalUsers     = User::where('role', 'user')->count();
        $enAttente      = Demande::where('status', 'en_attente')->count();
        $acceptees      = Demande::where('status', 'acceptee')->count();
        $refusees       = Demande::where('status', 'refusee')->count();

        // ── Par type ─────────────────────────────────
        $parType = Demande::select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->pluck('total', 'type');

        // ── Par statut ───────────────────────────────
        $parStatut = Demande::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // ── Par département ──────────────────────────
        $parDepartement = Demande::join('users', 'demandes.user_id', '=', 'users.id')
            ->select('users.department', DB::raw('count(*) as total'))
            ->groupBy('users.department')
            ->pluck('total', 'department');

        // ── Par mois (12 derniers mois) ───────────────
        $parMois = Demande::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as mois"),
                DB::raw('count(*) as total')
            )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        // ── Taux d'approbation ───────────────────────
        $tauxApprobation = $totalDemandes > 0
            ? round(($acceptees / $totalDemandes) * 100, 1)
            : 0;

        return response()->json([
            'total_demandes'   => $totalDemandes,
            'total_users'      => $totalUsers,
            'en_attente'       => $enAttente,
            'acceptees'        => $acceptees,
            'refusees'         => $refusees,
            'taux_approbation' => $tauxApprobation,
            'par_type'         => $parType,
            'par_statut'       => $parStatut,
            'par_departement'  => $parDepartement,
            'par_mois'         => $parMois,
        ]);
    }
}
