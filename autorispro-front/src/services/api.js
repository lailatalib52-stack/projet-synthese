// src/services/api.js
// ── Centralise tous les appels vers le backend Laravel ──

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/** Récupère le token stocké */
const getToken = () => localStorage.getItem('token');

/** Headers communs */
const headers = () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/** Fetch générique avec gestion d'erreurs */
async function request(method, endpoint, body = null) {
  const options = { method, headers: headers() };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) {
    const msg = data.message || data.errors
      ? Object.values(data.errors || {}).flat().join(' ')
      : 'Erreur serveur';
    throw new Error(msg);
  }
  return data;
}

// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════
export const authAPI = {
  login:  (email, password) => request('POST', '/login', { email, password }),
  logout: ()                => request('POST', '/logout'),
  me:     ()                => request('GET',  '/me'),
};

// ═══════════════════════════════════════════════
// DEMANDES — Utilisateur
// ═══════════════════════════════════════════════
export const demandeAPI = {
  // Utilisateur
  mesDemandes: ()       => request('GET',  '/mes-demandes'),
  create:      (data)   => request('POST', '/demandes', data),

  // Manager
  index:          ()        => request('GET', '/demandes'),
  enAttente:      ()        => request('GET', '/demandes/en-attente'),
  historique:     ()        => request('GET', '/demandes/historique'),
  show:           (id)      => request('GET', `/demandes/${id}`),
  accepter:       (id, comment) => request('PUT', `/demandes/${id}/accepter`, { comment }),
  refuser:        (id, comment) => request('PUT', `/demandes/${id}/refuser`,  { comment }),
  actionGroupee:  (ids, action, comment) =>
    request('POST', '/demandes/action-groupee', { ids, action, comment }),

  // Admin
  toutesLesDemandes: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request('GET', `/toutes-demandes${params ? '?' + params : ''}`);
  },
};

// ═══════════════════════════════════════════════
// USERS — Admin & Manager
// ═══════════════════════════════════════════════
export const userAPI = {
  monEquipe: ()     => request('GET',    '/equipe'),
  list:      ()     => request('GET',    '/users'),
  create:    (data) => request('POST',   '/users', data),
  update:    (id, data) => request('PUT', `/users/${id}`, data),
  delete:    (id)   => request('DELETE', `/users/${id}`),
};

// ═══════════════════════════════════════════════
// STATS — Admin
// ═══════════════════════════════════════════════
export const statAPI = {
  index: () => request('GET', '/stats'),
};
