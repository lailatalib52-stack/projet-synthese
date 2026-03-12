// src/App.jsx
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { demandeAPI, userAPI, statAPI } from './services/api';
import { useFetch, useMutation } from './hooks/useFetch';

// ══════════════════════════════════════════════
//  STYLES GLOBAUX
// ══════════════════════════════════════════════
const G = {
  font: "'Nunito','Segoe UI',sans-serif",
  primary: '#6366F1',
  success: '#10B981',
  danger:  '#EF4444',
  warning: '#F59E0B',
  dark:    '#0F172A',
  gray:    '#64748B',
  light:   '#F8FAFC',
  border:  '#F1F5F9',
};

// ══════════════════════════════════════════════
//  ICONS (SVG inline)
// ══════════════════════════════════════════════
const Icon = ({ name, size = 18 }) => {
  const icons = {
    shield:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    dash:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    doc:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    users:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    stats:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    logout:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    x:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    clock:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    bell:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    menu:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    eye:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    trash:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    calendar:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    search:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alert:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    team:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
  };
  return icons[name] || null;
};

// ══════════════════════════════════════════════
//  UI COMPONENTS
// ══════════════════════════════════════════════
const Btn = ({ variant = 'primary', children, icon, style: s, ...p }) => {
  const v = {
    primary: { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none' },
    success: { background: 'linear-gradient(135deg,#10B981,#059669)', color: '#fff', border: 'none' },
    danger:  { background: 'linear-gradient(135deg,#EF4444,#DC2626)', color: '#fff', border: 'none' },
    light:   { background: '#F1F5F9', color: '#374151', border: 'none' },
  };
  return <button {...p} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:G.font, ...v[variant], ...s }}>{icon && <Icon name={icon} size={15}/>}{children}</button>;
};

const StatusBadge = ({ status }) => {
  const c = { en_attente: { label:'En attente', bg:'#FEF3C7', color:'#92400E', dot:'#F59E0B' }, acceptee: { label:'Acceptée', bg:'#D1FAE5', color:'#065F46', dot:'#10B981' }, refusee: { label:'Refusée', bg:'#FEE2E2', color:'#991B1B', dot:'#EF4444' } }[status] || {};
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, background:c.bg, color:c.color, fontSize:12, fontWeight:600 }}><span style={{ width:6, height:6, borderRadius:'50%', background:c.dot, display:'inline-block' }}/>{c.label}</span>;
};

const TypeBadge = ({ type }) => {
  const c = { absence:{ label:'Absence', bg:'#EEF2FF', color:'#3730A3' }, sortie:{ label:'Sortie', bg:'#F0FDF4', color:'#166534' }, conge:{ label:'Congé', bg:'#FDF4FF', color:'#6B21A8' } }[type] || {};
  return <span style={{ padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color, fontSize:12, fontWeight:600 }}>{c.label}</span>;
};

const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(5px)' }}/>
      <div style={{ position:'relative', background:'#fff', borderRadius:20, padding:'32px 36px', width:'100%', maxWidth:wide?700:520, boxShadow:'0 30px 70px rgba(0,0,0,0.2)', animation:'modalIn 0.2s ease', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h3 style={{ margin:0, fontSize:20, fontWeight:700, color:G.dark }}>{title}</h3>
          <button onClick={onClose} style={{ background:'#F1F5F9', border:'none', borderRadius:10, width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:G.gray }}><Icon name="x" size={16}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Inp = ({ label, ...p }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:'block', marginBottom:6, fontSize:13, fontWeight:600, color:'#374151' }}>{label}</label>}
    <input {...p} style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:G.dark, background:'#FAFAFA', outline:'none', boxSizing:'border-box', fontFamily:G.font, ...p.style }} onFocus={e=>e.target.style.borderColor=G.primary} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
  </div>
);

const Sel = ({ label, children, ...p }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:'block', marginBottom:6, fontSize:13, fontWeight:600, color:'#374151' }}>{label}</label>}
    <select {...p} style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:G.dark, background:'#FAFAFA', outline:'none', boxSizing:'border-box', fontFamily:G.font }}>{children}</select>
  </div>
);

const Txt = ({ label, ...p }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:'block', marginBottom:6, fontSize:13, fontWeight:600, color:'#374151' }}>{label}</label>}
    <textarea {...p} style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, color:G.dark, background:'#FAFAFA', outline:'none', boxSizing:'border-box', fontFamily:G.font, resize:'vertical', minHeight:85, ...p.style }} onFocus={e=>e.target.style.borderColor=G.primary} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
  </div>
);

const Loading = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60, color:G.gray }}>
    <div style={{ width:36, height:36, border:'3px solid #E2E8F0', borderTopColor:G.primary, borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
  </div>
);

const ErrMsg = ({ msg }) => msg
  ? <div style={{ padding:'12px 16px', background:'#FEE2E2', color:'#991B1B', borderRadius:10, fontSize:13, marginBottom:16 }}>{msg}</div>
  : null;

const StatCard = ({ label, value, icon, color, bg }) => (
  <div style={{ background:'#fff', borderRadius:16, padding:'22px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:16, border:'1px solid '+G.border }}>
    <div style={{ width:50, height:50, borderRadius:14, background:bg, display:'flex', alignItems:'center', justifyContent:'center', color, flexShrink:0 }}><Icon name={icon} size={22}/></div>
    <div><div style={{ fontSize:26, fontWeight:800, color:G.dark, lineHeight:1 }}>{value ?? '—'}</div><div style={{ fontSize:13, color:G.gray, marginTop:3, fontWeight:500 }}>{label}</div></div>
  </div>
);

const th = { padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:G.gray, textTransform:'uppercase', letterSpacing:0.5 };
const td = { padding:'13px 16px', verticalAlign:'middle' };

// ══════════════════════════════════════════════
//  LOGIN PAGE
// ══════════════════════════════════════════════
function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(''); setLoading(true);
    try { await login(email, password); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:G.font, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-120, right:-120, width:450, height:450, borderRadius:'50%', background:'rgba(139,92,246,0.15)' }}/>
      <div style={{ position:'relative', width:'100%', maxWidth:440, margin:'0 20px' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:72, height:72, background:'rgba(255,255,255,0.15)', borderRadius:22, marginBottom:16, color:'#fff' }}><Icon name="shield" size={34}/></div>
          <h1 style={{ margin:0, color:'#fff', fontSize:30, fontWeight:800 }}>AutorisPro</h1>
          <p style={{ margin:'8px 0 0', color:'rgba(255,255,255,0.65)', fontSize:14 }}>Plateforme OFPPT — Gestion des Autorisations</p>
        </div>
        <div style={{ background:'#fff', borderRadius:24, padding:'36px 40px', boxShadow:'0 30px 80px rgba(0,0,0,0.25)' }}>
          <h2 style={{ margin:'0 0 24px', fontSize:20, fontWeight:700, color:G.dark }}>Connexion</h2>
          <ErrMsg msg={error}/>
          <Inp label="Adresse email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.ma"/>
          <Inp label="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
          <Btn variant="primary" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:15, marginTop:8, opacity:loading?0.7:1 }} onClick={handleLogin} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Btn>
          <div style={{ marginTop:20, padding:14, background:'#F8FAFC', borderRadius:12, border:'1px dashed #CBD5E1' }}>
            <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase' }}>Comptes de démo</p>
            {[{ label:'Utilisateur', email:'y.benali@ofppt.ma', pwd:'user123', color:'#6366F1' },{ label:'Manager', email:'k.mansouri@ofppt.ma', pwd:'manager123', color:'#8B5CF6' },{ label:'Admin', email:'n.elamrani@ofppt.ma', pwd:'admin123', color:'#EC4899' }].map(a=>(
              <div key={a.label} onClick={()=>{setEmail(a.email);setPassword(a.pwd);setError('');}} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 12px', borderRadius:8, cursor:'pointer', marginBottom:4, background:'#fff', border:'1px solid #E2E8F0' }}>
                <span style={{ fontSize:12, fontWeight:700, color:a.color }}>{a.label}</span>
                <span style={{ fontSize:11, color:'#94A3B8' }}>{a.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════
function Sidebar({ page, setPage, collapsed, toggle }) {
  const { user, logout } = useAuth();
  const roleColors = { user:'#6366F1', manager:'#8B5CF6', admin:'#EC4899' };
  const roleLabels = { user:'Utilisateur', manager:'Manager', admin:'Administrateur' };
  const nav = [
    { id:'dashboard',      label:'Tableau de bord',     icon:'dash',    roles:['user'] },
    { id:'my_requests',    label:'Mes demandes',         icon:'doc',     roles:['user'] },
    { id:'mgr_dashboard',  label:'Tableau de bord',     icon:'dash',    roles:['manager'] },
    { id:'mgr_pending',    label:'Demandes en attente',  icon:'alert',   roles:['manager'] },
    { id:'mgr_all',        label:'Toutes les demandes',  icon:'doc',     roles:['manager'] },
    { id:'mgr_team',       label:'Mon équipe',           icon:'team',    roles:['manager'] },
    { id:'mgr_history',    label:'Historique',           icon:'history', roles:['manager'] },
    { id:'adm_dashboard',  label:'Tableau de bord',     icon:'dash',    roles:['admin'] },
    { id:'adm_users',      label:'Utilisateurs',         icon:'users',   roles:['admin'] },
    { id:'adm_requests',   label:'Toutes les demandes',  icon:'doc',     roles:['admin'] },
    { id:'adm_stats',      label:'Statistiques',         icon:'stats',   roles:['admin'] },
  ].filter(n => n.roles.includes(user?.role));

  return (
    <div style={{ width:collapsed?72:264, flexShrink:0, height:'100vh', background:'#0F172A', display:'flex', flexDirection:'column', transition:'width 0.3s', position:'sticky', top:0, overflow:'hidden' }}>
      <div style={{ padding:collapsed?'20px 0':'22px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width:38, height:38, background:'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginLeft:collapsed?'auto':0, marginRight:collapsed?'auto':0, color:'#fff' }}><Icon name="shield" size={18}/></div>
        {!collapsed && <div><div style={{ color:'#fff', fontWeight:800, fontSize:16 }}>AutorisPro</div><div style={{ color:'#475569', fontSize:11 }}>OFPPT Platform</div></div>}
      </div>
      {!collapsed && user && <div style={{ margin:'10px 14px 4px', padding:'7px 12px', background:'rgba(99,102,241,0.1)', borderRadius:9, display:'flex', alignItems:'center', gap:8, border:'1px solid rgba(99,102,241,0.15)' }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background:roleColors[user.role] }}/>
        <span style={{ color:roleColors[user.role], fontSize:12, fontWeight:700 }}>{roleLabels[user.role]}</span>
      </div>}
      <nav style={{ flex:1, padding:'8px 10px', overflowY:'auto' }}>
        {nav.map(item => {
          const active = page === item.id;
          return <button key={item.id} onClick={()=>setPage(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:collapsed?'12px 0':'10px 13px', borderRadius:11, border:'none', cursor:'pointer', background:active?'rgba(99,102,241,0.18)':'transparent', color:active?'#A5B4FC':'#64748B', fontWeight:active?700:500, fontSize:13.5, marginBottom:3, justifyContent:collapsed?'center':'flex-start', fontFamily:G.font }}>
            <span style={{ flexShrink:0, color:active?'#818CF8':'#475569' }}><Icon name={item.icon} size={17}/></span>
            {!collapsed && item.label}
          </button>;
        })}
      </nav>
      <div style={{ padding:collapsed?'14px 10px':'14px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        {!collapsed && user && <div style={{ display:'flex', alignItems:'center', gap:10, padding:12, background:'rgba(255,255,255,0.04)', borderRadius:12, marginBottom:8 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:roleColors[user.role], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:13, flexShrink:0 }}>{user.avatar}</div>
          <div style={{ overflow:'hidden' }}><div style={{ color:'#F1F5F9', fontWeight:700, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div><div style={{ color:'#475569', fontSize:11 }}>{user.department}</div></div>
        </div>}
        <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'9px 13px', borderRadius:11, border:'none', cursor:'pointer', background:'transparent', color:'#EF4444', fontWeight:600, fontSize:13, justifyContent:collapsed?'center':'flex-start', fontFamily:G.font }}>
          <Icon name="logout" size={16}/>{!collapsed && 'Déconnexion'}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  TOPBAR
// ══════════════════════════════════════════════
function TopBar({ title, toggle }) {
  const { user } = useAuth();
  return (
    <div style={{ height:64, background:'#fff', borderBottom:'1px solid '+G.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={toggle} style={{ background:'none', border:'none', cursor:'pointer', color:G.gray, display:'flex' }}><Icon name="menu" size={20}/></button>
        <h1 style={{ margin:0, fontSize:18, fontWeight:700, color:G.dark }}>{title}</h1>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:G.gray }}><Icon name="bell" size={17}/></button>
        <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#6366F1,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}>{user?.avatar}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: USER — Mes Demandes
// ══════════════════════════════════════════════
function MyRequestsPage() {
  const { data: demandes, loading, error, refetch } = useFetch(demandeAPI.mesDemandes);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ type:'absence', reason:'', start_date:'', end_date:'' });
  const { mutate: create, loading: creating, error: createErr } = useMutation(demandeAPI.create);

  const handleCreate = async () => {
    if (!form.reason || !form.start_date || !form.end_date) return;
    await create(form);
    setShowNew(false);
    setForm({ type:'absence', reason:'', start_date:'', end_date:'' });
    refetch();
  };

  if (loading) return <Loading/>;

  return (
    <div>
      <ErrMsg msg={error}/>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <Btn variant="primary" icon="plus" onClick={()=>setShowNew(true)}>Nouvelle demande</Btn>
      </div>
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'#F8FAFC' }}><th style={th}>Type</th><th style={th}>Motif</th><th style={th}>Période</th><th style={th}>Statut</th><th style={th}>Commentaire</th></tr></thead>
          <tbody>
            {(!demandes||demandes.length===0)
              ? <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>Aucune demande trouvée</td></tr>
              : demandes.map(r => (
                <tr key={r.id} style={{ borderTop:'1px solid '+G.border }}>
                  <td style={td}><TypeBadge type={r.type}/></td>
                  <td style={td}><div style={{ fontSize:13, color:'#374151', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.reason}</div></td>
                  <td style={td}><div style={{ fontSize:12, color:G.gray }}>{r.start_date} → {r.end_date}</div></td>
                  <td style={td}><StatusBadge status={r.status}/></td>
                  <td style={td}><div style={{ fontSize:12, color:G.gray, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.comment || <span style={{ color:'#CBD5E1' }}>—</span>}</div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvelle demande d'autorisation">
        <ErrMsg msg={createErr}/>
        <Sel label="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="absence">🏥 Absence</option><option value="sortie">🚪 Sortie</option><option value="conge">🌴 Congé</option></Sel>
        <Txt label="Motif *" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="Décrivez votre demande..."/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Inp label="Date début *" type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})}/>
          <Inp label="Date fin *" type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})}/>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn variant="light" onClick={()=>setShowNew(false)}>Annuler</Btn>
          <Btn variant="primary" icon="plus" onClick={handleCreate} style={{ opacity:creating?0.7:1 }}>{creating?'Envoi...':'Soumettre'}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: MANAGER — Demandes en attente
// ══════════════════════════════════════════════
function ManagerPendingPage() {
  const { data: demandes, loading, error, refetch } = useFetch(demandeAPI.enAttente);
  const { mutate: accepter } = useMutation(demandeAPI.accepter);
  const { mutate: refuser  } = useMutation(demandeAPI.refuser);
  const { mutate: groupee  } = useMutation(demandeAPI.actionGroupee);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');
  const [bulk, setBulk] = useState([]);

  const doAction = async (id, action, cmt) => {
    if (action === 'acceptee') await accepter(id, cmt);
    else await refuser(id, cmt);
    refetch();
  };

  const doBulk = async (action) => {
    await groupee(bulk, action, 'Action groupée');
    setBulk([]); refetch();
  };

  if (loading) return <Loading/>;

  const pending = demandes || [];

  return (
    <div>
      <ErrMsg msg={error}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        <div style={{ background:'#FEF3C7', borderRadius:14, padding:'16px 20px', border:'1px solid #FCD34D' }}><div style={{ fontSize:26, fontWeight:800, color:'#92400E' }}>{pending.length}</div><div style={{ fontSize:13, color:'#B45309', fontWeight:600 }}>En attente</div></div>
        <div style={{ background:'#D1FAE5', borderRadius:14, padding:'16px 20px', border:'1px solid #6EE7B7' }}><div style={{ fontSize:26, fontWeight:800, color:'#065F46' }}>{pending.filter(r=>r.type==='absence').length}</div><div style={{ fontSize:13, color:'#047857', fontWeight:600 }}>Absences</div></div>
        <div style={{ background:'#EEF2FF', borderRadius:14, padding:'16px 20px', border:'1px solid #C7D2FE' }}><div style={{ fontSize:26, fontWeight:800, color:'#3730A3' }}>{pending.filter(r=>r.type==='conge').length}</div><div style={{ fontSize:13, color:'#4338CA', fontWeight:600 }}>Congés</div></div>
      </div>

      {bulk.length > 0 && (
        <div style={{ background:'#0F172A', borderRadius:12, padding:'12px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:'#fff', fontSize:13, fontWeight:600 }}>{bulk.length} sélectionnée(s)</span>
          <Btn variant="success" icon="check" onClick={()=>doBulk('acceptee')}>Accepter tout</Btn>
          <Btn variant="danger" icon="x" onClick={()=>doBulk('refusee')}>Refuser tout</Btn>
          <button onClick={()=>setBulk([])} style={{ marginLeft:'auto', background:'none', border:'none', color:'#94A3B8', cursor:'pointer' }}><Icon name="x" size={16}/></button>
        </div>
      )}

      {pending.length === 0
        ? <div style={{ background:'#fff', borderRadius:16, padding:'60px 40px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border }}><div style={{ fontSize:48, marginBottom:12 }}>🎉</div><div style={{ fontSize:18, fontWeight:700, color:G.dark }}>Tout est traité !</div></div>
        : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {pending.map(req => (
            <div key={req.id} style={{ background:'#fff', borderRadius:14, padding:'18px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:bulk.includes(req.id)?'2px solid #6366F1':'1px solid '+G.border }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <input type="checkbox" checked={bulk.includes(req.id)} onChange={()=>setBulk(p=>p.includes(req.id)?p.filter(x=>x!==req.id):[...p,req.id])} style={{ marginTop:4, width:16, height:16, cursor:'pointer', accentColor:'#6366F1' }}/>
                <div style={{ width:44, height:44, borderRadius:12, background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:'#6366F1', flexShrink:0 }}>{req.user?.avatar || '??'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                    <span style={{ fontWeight:700, fontSize:15, color:G.dark }}>{req.user?.name}</span>
                    <TypeBadge type={req.type}/>
                    <span style={{ fontSize:12, color:'#94A3B8' }}>{req.user?.department}</span>
                  </div>
                  <div style={{ fontSize:14, color:'#374151', marginBottom:6 }}>{req.reason}</div>
                  <div style={{ display:'flex', gap:16 }}>
                    <span style={{ fontSize:12, color:G.gray }}><Icon name="calendar" size={12}/> {req.start_date} → {req.end_date}</span>
                    <span style={{ fontSize:12, color:'#94A3B8' }}>Soumis le {req.created_at?.slice(0,10)}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0, alignItems:'center' }}>
                  <button onClick={()=>{setSelected(req);setComment('');}} style={{ background:'#F1F5F9', border:'none', borderRadius:9, padding:'8px 14px', cursor:'pointer', color:'#374151', fontSize:13, fontWeight:600, fontFamily:G.font }}>Détails</button>
                  <Btn variant="success" icon="check" onClick={()=>doAction(req.id,'acceptee','')}>Accepter</Btn>
                  <Btn variant="danger" icon="x" onClick={()=>doAction(req.id,'refusee','')}>Refuser</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Traiter la demande" wide>
        {selected && <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
            {[{ label:'Demandeur', val:selected.user?.name },{ label:'Département', val:selected.user?.department },{ label:'Type', val:<TypeBadge type={selected.type}/> },{ label:'Date début', val:selected.start_date },{ label:'Date fin', val:selected.end_date },{ label:'Soumis le', val:selected.created_at?.slice(0,10) }].map(item => (
              <div key={item.label} style={{ padding:12, background:'#F8FAFC', borderRadius:10 }}>
                <div style={{ fontSize:11, color:'#94A3B8', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{item.val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:14, background:'#F8FAFC', borderRadius:10, marginBottom:16 }}><div style={{ fontSize:11, color:'#94A3B8', fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>Motif</div><div style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{selected.reason}</div></div>
          <Txt label="Commentaire (optionnel)" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Expliquez votre décision..." style={{ minHeight:80 }}/>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Btn variant="light" onClick={()=>setSelected(null)}>Annuler</Btn>
            <Btn variant="danger" icon="x" onClick={async()=>{await doAction(selected.id,'refusee',comment);setSelected(null);}}>Refuser</Btn>
            <Btn variant="success" icon="check" onClick={async()=>{await doAction(selected.id,'acceptee',comment);setSelected(null);}}>Accepter</Btn>
          </div>
        </div>}
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: MANAGER — Équipe
// ══════════════════════════════════════════════
function ManagerTeamPage() {
  const { data: equipe, loading, error } = useFetch(userAPI.monEquipe);
  if (loading) return <Loading/>;
  return (
    <div>
      <ErrMsg msg={error}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {(equipe||[]).map(m => (
          <div key={m.id} style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#6366F1,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16 }}>{m.avatar}</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:15, color:G.dark }}>{m.name}</div><div style={{ fontSize:12, color:'#94A3B8' }}>{m.department}</div></div>
              <span style={{ padding:'3px 10px', borderRadius:20, background:m.status==='actif'?'#D1FAE5':'#FEE2E2', color:m.status==='actif'?'#065F46':'#991B1B', fontSize:11, fontWeight:700 }}>{m.status}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              <div style={{ textAlign:'center', padding:'10px 8px', background:'#F8FAFC', borderRadius:10 }}><div style={{ fontSize:20, fontWeight:800, color:G.dark }}>{m.demandes_count||0}</div><div style={{ fontSize:11, color:G.gray }}>Total</div></div>
              <div style={{ textAlign:'center', padding:'10px 8px', background:'#D1FAE5', borderRadius:10 }}><div style={{ fontSize:20, fontWeight:800, color:'#065F46' }}>{m.demandes_acceptees_count||0}</div><div style={{ fontSize:11, color:'#047857' }}>Acceptées</div></div>
              <div style={{ textAlign:'center', padding:'10px 8px', background:m.demandes_en_attente_count>0?'#FEF3C7':'#F8FAFC', borderRadius:10 }}><div style={{ fontSize:20, fontWeight:800, color:m.demandes_en_attente_count>0?'#92400E':G.dark }}>{m.demandes_en_attente_count||0}</div><div style={{ fontSize:11, color:m.demandes_en_attente_count>0?'#B45309':G.gray }}>En att.</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: MANAGER — Toutes demandes / Historique
// ══════════════════════════════════════════════
function ManagerAllPage({ historyOnly = false }) {
  const fn = historyOnly ? demandeAPI.historique : demandeAPI.index;
  const { data: demandes, loading, error, refetch } = useFetch(fn);
  const { mutate: accepter } = useMutation(demandeAPI.accepter);
  const { mutate: refuser  } = useMutation(demandeAPI.refuser);
  const [detail, setDetail] = useState(null);
  const [comment, setComment] = useState('');

  const doAction = async (id, action, cmt) => {
    if (action === 'acceptee') await accepter(id, cmt);
    else await refuser(id, cmt);
    refetch();
  };

  if (loading) return <Loading/>;

  return (
    <div>
      <ErrMsg msg={error}/>
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'#F8FAFC' }}><th style={th}>Demandeur</th><th style={th}>Type</th><th style={th}>Motif</th><th style={th}>Période</th><th style={th}>Statut</th><th style={th}>Actions</th></tr></thead>
          <tbody>
            {(!demandes||demandes.length===0)
              ? <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>Aucune demande</td></tr>
              : demandes.map(req => (
                <tr key={req.id} style={{ borderTop:'1px solid '+G.border }}>
                  <td style={td}>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:34, height:34, borderRadius:9, background:'#EEF2FF', color:'#6366F1', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, flexShrink:0 }}>{req.user?.avatar||'??'}</div>
                      <div><div style={{ fontWeight:600, fontSize:13, color:G.dark }}>{req.user?.name}</div><div style={{ fontSize:11, color:'#94A3B8' }}>{req.user?.department}</div></div>
                    </div>
                  </td>
                  <td style={td}><TypeBadge type={req.type}/></td>
                  <td style={td}><div style={{ fontSize:13, color:'#374151', maxWidth:190, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{req.reason}</div></td>
                  <td style={td}><div style={{ fontSize:12, color:G.gray }}>{req.start_date} → {req.end_date}</div></td>
                  <td style={td}><StatusBadge status={req.status}/></td>
                  <td style={td}>
                    <div style={{ display:'flex', gap:5 }}>
                      <button onClick={()=>{setDetail(req);setComment('');}} style={{ background:'#EEF2FF', border:'none', borderRadius:8, padding:'6px 8px', cursor:'pointer', color:'#6366F1' }}><Icon name="eye" size={14}/></button>
                      {!historyOnly && req.status==='en_attente' && <>
                        <button onClick={()=>doAction(req.id,'acceptee','')} style={{ background:'#D1FAE5', border:'none', borderRadius:8, padding:'6px 8px', cursor:'pointer', color:'#10B981' }}><Icon name="check" size={14}/></button>
                        <button onClick={()=>doAction(req.id,'refusee','')} style={{ background:'#FEE2E2', border:'none', borderRadius:8, padding:'6px 8px', cursor:'pointer', color:'#EF4444' }}><Icon name="x" size={14}/></button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!detail} onClose={()=>setDetail(null)} title="Détail de la demande">
        {detail && <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {[{ label:'Type', val:<TypeBadge type={detail.type}/> },{ label:'Statut', val:<StatusBadge status={detail.status}/> },{ label:'Dates', val:`${detail.start_date} → ${detail.end_date}` },{ label:'Demandeur', val:detail.user?.name }].map(item => (
              <div key={item.label} style={{ padding:12, background:'#F8FAFC', borderRadius:10 }}>
                <div style={{ fontSize:11, color:'#94A3B8', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{item.val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:12, background:'#F8FAFC', borderRadius:10, marginBottom:14 }}><div style={{ fontSize:11, color:'#94A3B8', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>Motif</div><div style={{ fontSize:14, color:'#374151' }}>{detail.reason}</div></div>
          {!historyOnly && detail.status==='en_attente' && <div>
            <Txt label="Commentaire" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Votre décision..."/>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <Btn variant="danger" icon="x" onClick={async()=>{await doAction(detail.id,'refusee',comment);setDetail(null);}}>Refuser</Btn>
              <Btn variant="success" icon="check" onClick={async()=>{await doAction(detail.id,'acceptee',comment);setDetail(null);}}>Accepter</Btn>
            </div>
          </div>}
          {detail.comment && <div style={{ padding:14, background:'#FEF3C7', borderRadius:10, marginTop:12 }}><div style={{ fontSize:11, color:'#92400E', fontWeight:700, marginBottom:4 }}>COMMENTAIRE</div><div style={{ fontSize:13, color:'#92400E' }}>{detail.comment}</div></div>}
        </div>}
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: ADMIN — Stats
// ══════════════════════════════════════════════
function AdminStatsPage() {
  const { data: stats, loading, error } = useFetch(statAPI.index);
  if (loading) return <Loading/>;
  if (!stats) return <ErrMsg msg={error}/>;
  const Bar = ({ label, count, color, max }) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{label}</span><span style={{ fontSize:13, fontWeight:700, color }}>{count}</span></div>
      <div style={{ height:10, background:'#F1F5F9', borderRadius:6, overflow:'hidden' }}><div style={{ width:`${max?(count/max)*100:0}%`, height:'100%', background:color, borderRadius:6 }}/></div>
    </div>
  );
  const total = stats.total_demandes;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:14, marginBottom:22 }}>
        <StatCard label="Utilisateurs" value={stats.total_users} icon="users" color="#6366F1" bg="#EEF2FF"/>
        <StatCard label="Total demandes" value={total} icon="doc" color="#8B5CF6" bg="#F5F3FF"/>
        <StatCard label="En attente" value={stats.en_attente} icon="clock" color="#F59E0B" bg="#FEF3C7"/>
        <StatCard label="Taux d'approbation" value={`${stats.taux_approbation}%`} icon="check" color="#10B981" bg="#D1FAE5"/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border }}>
          <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700, color:G.dark }}>Par type</h3>
          <Bar label="Absence" count={stats.par_type?.absence||0} color="#6366F1" max={total}/>
          <Bar label="Congé"   count={stats.par_type?.conge||0}   color="#8B5CF6" max={total}/>
          <Bar label="Sortie"  count={stats.par_type?.sortie||0}  color="#10B981" max={total}/>
        </div>
        <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border }}>
          <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700, color:G.dark }}>Par statut</h3>
          <Bar label="En attente" count={stats.par_statut?.en_attente||0} color="#F59E0B" max={total}/>
          <Bar label="Acceptées"  count={stats.par_statut?.acceptee||0}   color="#10B981" max={total}/>
          <Bar label="Refusées"   count={stats.par_statut?.refusee||0}    color="#EF4444" max={total}/>
        </div>
        <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border, gridColumn:'1/-1' }}>
          <h3 style={{ margin:'0 0 16px', fontSize:16, fontWeight:700, color:G.dark }}>Par département</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12 }}>
            {Object.entries(stats.par_departement||{}).map(([dept,count],i) => {
              const colors = ['#6366F1','#8B5CF6','#EC4899','#F59E0B','#10B981'];
              return <div key={dept} style={{ padding:16, background:'#F8FAFC', borderRadius:12, textAlign:'center' }}><div style={{ fontSize:26, fontWeight:800, color:colors[i%colors.length] }}>{count}</div><div style={{ fontSize:13, color:G.gray, marginTop:4, fontWeight:500 }}>{dept}</div></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PAGE: ADMIN — Utilisateurs
// ══════════════════════════════════════════════
function AdminUsersPage() {
  const { data: users, loading, error, refetch } = useFetch(userAPI.list);
  const { mutate: create, loading: creating } = useMutation(userAPI.create);
  const { mutate: remove } = useMutation(userAPI.delete);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user', department:'' });

  const handleCreate = async () => {
    if (!form.name||!form.email||!form.password) return;
    await create(form);
    setShowNew(false); setForm({ name:'',email:'',password:'',role:'user',department:'' }); refetch();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) { await remove(id); refetch(); }
  };

  const roleColors = { user:'#6366F1', manager:'#8B5CF6', admin:'#EC4899' };
  const roleLabels = { user:'Utilisateur', manager:'Manager', admin:'Administrateur' };

  if (loading) return <Loading/>;

  return (
    <div>
      <ErrMsg msg={error}/>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:18 }}><Btn variant="primary" icon="plus" onClick={()=>setShowNew(true)}>Nouvel utilisateur</Btn></div>
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid '+G.border }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'#F8FAFC' }}><th style={th}>Utilisateur</th><th style={th}>Email</th><th style={th}>Rôle</th><th style={th}>Département</th><th style={th}>Statut</th><th style={th}>Demandes</th><th style={th}>Actions</th></tr></thead>
          <tbody>
            {(users||[]).map(u => (
              <tr key={u.id} style={{ borderTop:'1px solid '+G.border }}>
                <td style={td}><div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:36, height:36, borderRadius:10, background:(roleColors[u.role]||'#6366F1')+'22', color:roleColors[u.role]||'#6366F1', fontWeight:800, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}>{u.avatar}</div><span style={{ fontWeight:600, fontSize:14, color:G.dark }}>{u.name}</span></div></td>
                <td style={td}><span style={{ fontSize:13, color:G.gray }}>{u.email}</span></td>
                <td style={td}><span style={{ padding:'4px 10px', borderRadius:20, background:(roleColors[u.role]||'#6366F1')+'18', color:roleColors[u.role]||'#6366F1', fontSize:12, fontWeight:700 }}>{roleLabels[u.role]||u.role}</span></td>
                <td style={td}><span style={{ fontSize:13, color:'#374151' }}>{u.department}</span></td>
                <td style={td}><span style={{ padding:'4px 10px', borderRadius:20, background:u.status==='actif'?'#D1FAE5':'#FEE2E2', color:u.status==='actif'?'#065F46':'#991B1B', fontSize:12, fontWeight:600 }}>{u.status}</span></td>
                <td style={td}><span style={{ fontSize:13, fontWeight:600, color:G.dark }}>{u.demandes_count||0}</span></td>
                <td style={td}><button onClick={()=>handleDelete(u.id)} style={{ background:'#FEE2E2', border:'none', borderRadius:8, padding:'6px 8px', cursor:'pointer', color:'#EF4444' }}><Icon name="trash" size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nouvel utilisateur">
        <Inp label="Nom complet *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Prénom Nom"/>
        <Inp label="Email *" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@ofppt.ma"/>
        <Inp label="Mot de passe *" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="min. 6 caractères"/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Sel label="Rôle" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="user">Utilisateur</option><option value="manager">Manager</option><option value="admin">Administrateur</option></Sel>
          <Inp label="Département" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="Ex: Informatique"/>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}><Btn variant="light" onClick={()=>setShowNew(false)}>Annuler</Btn><Btn variant="primary" icon="plus" onClick={handleCreate} style={{ opacity:creating?0.7:1 }}>{creating?'Création...':'Créer'}</Btn></div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════
//  MAIN LAYOUT
// ══════════════════════════════════════════════
const PAGE_TITLES = {
  dashboard:'Tableau de bord', my_requests:'Mes demandes',
  mgr_dashboard:'Tableau de bord Manager', mgr_pending:'Demandes en attente',
  mgr_all:'Toutes les demandes', mgr_team:'Mon équipe', mgr_history:'Historique',
  adm_dashboard:'Tableau de bord Admin', adm_users:'Gestion des utilisateurs',
  adm_requests:'Toutes les demandes', adm_stats:'Statistiques',
};

function AppLayout() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:G.font }}><Loading/></div>;
  if (!user) return <LoginPage/>;

  const defaultPage = { user:'my_requests', manager:'mgr_dashboard', admin:'adm_stats' }[user.role];
  const currentPage = page || defaultPage;

  const renderPage = () => {
    switch (currentPage) {
      case 'my_requests':   return <MyRequestsPage/>;
      case 'mgr_pending':   return <ManagerPendingPage/>;
      case 'mgr_all':       return <ManagerAllPage/>;
      case 'mgr_team':      return <ManagerTeamPage/>;
      case 'mgr_history':   return <ManagerAllPage historyOnly/>;
      case 'adm_users':     return <AdminUsersPage/>;
      case 'adm_requests':  return <ManagerAllPage/>;
      case 'adm_stats':     return <AdminStatsPage/>;
      default:              return <MyRequestsPage/>;
    }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F8FAFC', fontFamily:G.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        * { box-sizing:border-box; } body { margin:0; }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(-10px);}to{opacity:1;transform:scale(1) translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        button:hover { opacity:0.85; } tr:hover td { background:#FAFBFF; }
      `}</style>
      <Sidebar page={currentPage} setPage={setPage} collapsed={collapsed} toggle={()=>setCollapsed(!collapsed)}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <TopBar title={PAGE_TITLES[currentPage]||''} toggle={()=>setCollapsed(!collapsed)}/>
        <main style={{ flex:1, padding:'26px 30px', overflowY:'auto' }}>{renderPage()}</main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  EXPORT
// ══════════════════════════════════════════════
export default function App() {
  return <AuthProvider><AppLayout/></AuthProvider>;
}
