<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemandeController extends Controller
{
    // ───────────────────────────────────────────
    // UTILISATEUR
    // ───────────────────────────────────────────

    /**
     * GET /api/mes-demandes
     * L'utilisateur voit seulement SES demandes
     */
    public function mesDemandes()
    {
        $demandes = Demande::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($demandes);
    }

    /**
     * POST /api/demandes
     * L'utilisateur crée une nouvelle demande
     */
    public function store(Request $request)
    {
        $request->validate([
            'type'       => 'required|in:absence,sortie,conge',
            'reason'     => 'required|string|max:1000',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $user = Auth::user();

        $demande = Demande::create([
            'user_id'    => $user->id,
            'manager_id' => $user->manager_id,
            'type'       => $request->type,
            'reason'     => $request->reason,
            'start_date' => $request->start_date,
            'end_date'   => $request->end_date,
            'status'     => 'en_attente',
        ]);

        return response()->json([
            'message' => 'Demande soumise avec succès.',
            'demande' => $demande->load('user'),
        ], 201);
    }

    // ───────────────────────────────────────────
    // MANAGER
    // ───────────────────────────────────────────

    /**
     * GET /api/demandes
     * Manager voit toutes les demandes de son équipe
     */
    public function index()
    {
        $managerId = Auth::id();

        $demandes = Demande::where('manager_id', $managerId)
            ->with('user:id,name,department,avatar')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($demandes);
    }

    /**
     * GET /api/demandes/en-attente
     * Demandes en attente pour le manager connecté
     */
    public function enAttente()
    {
        $demandes = Demande::where('manager_id', Auth::id())
            ->where('status', 'en_attente')
            ->with('user:id,name,department,avatar')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($demandes);
    }

    /**
     * GET /api/demandes/historique
     * Demandes déjà traitées (acceptées ou refusées)
     */
    public function historique()
    {
        $demandes = Demande::where('manager_id', Auth::id())
            ->whereIn('status', ['acceptee', 'refusee'])
            ->with('user:id,name,department,avatar')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($demandes);
    }

    /**
     * GET /api/demandes/{id}
     */
    public function show($id)
    {
        $demande = Demande::where('manager_id', Auth::id())
            ->with('user:id,name,department,avatar')
            ->findOrFail($id);

        return response()->json($demande);
    }

    /**
     * PUT /api/demandes/{id}/accepter
     */
    public function accepter(Request $request, $id)
    {
        $request->validate([
            'comment' => 'nullable|string|max:500',
        ]);

        $demande = Demande::where('manager_id', Auth::id())
            ->where('status', 'en_attente')
            ->findOrFail($id);

        $demande->update([
            'status'  => 'acceptee',
            'comment' => $request->comment ?? '',
        ]);

        return response()->json([
            'message' => 'Demande acceptée.',
            'demande' => $demande->fresh('user'),
        ]);
    }

    /**
     * PUT /api/demandes/{id}/refuser
     */
    public function refuser(Request $request, $id)
    {
        $request->validate([
            'comment' => 'nullable|string|max:500',
        ]);

        $demande = Demande::where('manager_id', Auth::id())
            ->where('status', 'en_attente')
            ->findOrFail($id);

        $demande->update([
            'status'  => 'refusee',
            'comment' => $request->comment ?? '',
        ]);

        return response()->json([
            'message' => 'Demande refusée.',
            'demande' => $demande->fresh('user'),
        ]);
    }

    /**
     * POST /api/demandes/action-groupee
     * Accepter ou refuser plusieurs demandes à la fois
     */
    public function actionGroupee(Request $request)
    {
        $request->validate([
            'ids'     => 'required|array',
            'ids.*'   => 'integer|exists:demandes,id',
            'action'  => 'required|in:acceptee,refusee',
            'comment' => 'nullable|string|max:500',
        ]);

        $count = Demande::where('manager_id', Auth::id())
            ->where('status', 'en_attente')
            ->whereIn('id', $request->ids)
            ->update([
                'status'  => $request->action,
                'comment' => $request->comment ?? 'Action groupée',
            ]);

        return response()->json([
            'message' => "{$count} demande(s) traitée(s) avec succès.",
            'count'   => $count,
        ]);
    }

    // ───────────────────────────────────────────
    // ADMIN
    // ───────────────────────────────────────────

    /**
     * GET /api/toutes-demandes
     * Admin voit TOUTES les demandes
     */
    public function toutesLesDemandes(Request $request)
    {
        $query = Demande::with('user:id,name,department,avatar');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        if ($request->has('department')) {
            $query->whereHas('user', fn($q) => $q->where('department', $request->department));
        }

        $demandes = $query->orderBy('created_at', 'desc')->get();

        return response()->json($demandes);
    }
}
