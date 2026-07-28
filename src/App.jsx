import React, { useState, useEffect, useRef } from "react";
import {
  Vote, BarChart3, UserCog, KeyRound, Lock, LogOut, Plus, Trash2,
  Pencil, Check, ArrowLeft, ShieldCheck, Users, Menu, Unlock, X,
} from "lucide-react";
import * as XLSX from "xlsx";
import * as api from "./api";

const WEB_UTAMA_URL = "https://englishcommunity.example.com";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    .ec-root { --navy-950:#05070d; --navy-900:#090d17; --line:rgba(140,170,255,.09); --gold:#5686dd; --gold-soft:#93b6ee; --accent:#3d5a99; --text-hi:#f2f5fa; --text-lo:#8792a8; font-family:'Plus Jakarta Sans',sans-serif; background:var(--navy-950); color:var(--text-hi); min-height:100vh; line-height:1.5; }
    .ec-serif { font-family:'Outfit',sans-serif; font-weight:700; letter-spacing:-.02em; }
    .ec-fade { animation: ecFadeIn .5s ease both; }
    @keyframes ecFadeIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
    .ec-card { background:rgba(255,255,255,.02); backdrop-filter:blur(32px); border:1px solid rgba(255,255,255,.06); border-radius:20px; box-shadow:0 8px 32px rgba(0,0,0,.35); }
    .ec-card.clickable { cursor:pointer; }
    .ec-card.clickable:hover { border-color:rgba(86,134,221,.45); }
    .ec-navlink { display:flex; align-items:center; gap:11px; padding:12px 13px; border-radius:12px; color:var(--text-lo); cursor:pointer; border-left:2px solid transparent; font-size:14px; font-weight:500; }
    .ec-navlink:hover { background:rgba(255,255,255,.045); color:var(--text-hi); }
    .ec-navlink.active { background:linear-gradient(135deg,rgba(86,134,221,.14),rgba(255,255,255,.03)); border-left:2px solid var(--gold); color:var(--text-hi); }
    .ec-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 16px; border-radius:12px; font-size:13px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.025); color:var(--text-hi); white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; }
    .ec-btn.solid { background:var(--text-hi); color:var(--navy-950); border-color:var(--text-hi); }
    .ec-btn.danger { color:#d99a9a; }
    .ec-btn.danger:hover { background:rgba(180,60,60,.22); }
    .ec-btn.ghost { color:var(--text-lo); }
    .ec-btn:disabled { opacity:.4; cursor:not-allowed; }
    .ec-input, .ec-textarea { width:100%; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07); color:var(--text-hi); border-radius:12px; padding:10px 13px; font-size:13.5px; outline:none; font-family:'Plus Jakarta Sans',sans-serif; }
    .ec-textarea { resize:vertical; min-height:70px; }
    .ec-input:focus, .ec-textarea:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(86,134,221,.12); }
    .ec-label { font-size:11px; text-transform:uppercase; letter-spacing:.8px; font-weight:600; color:var(--text-lo); margin-bottom:6px; display:block; }
    .ec-badge { display:inline-flex; align-items:center; gap:6px; font-size:10.5px; text-transform:uppercase; font-weight:600; color:var(--text-lo); background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.06); border-radius:999px; padding:6px 12px; }
    .ec-table { width:100%; border-collapse:collapse; font-size:13.5px; }
    .ec-table th { text-align:left; font-size:10.5px; text-transform:uppercase; font-weight:700; color:var(--text-lo); padding:12px 14px; border-bottom:1px solid var(--line); }
    .ec-table td { padding:12px 14px; border-bottom:1px solid var(--line); }
    .ec-orbs { position:fixed; inset:0; overflow:hidden; z-index:0; pointer-events:none; background:radial-gradient(ellipse at top,#090d17 0%,#05070d 60%); }
    .ec-orb { position:absolute; border-radius:50%; filter:blur(110px); }
    .ec-orb-a { width:520px; height:520px; top:-160px; left:-140px; background:radial-gradient(circle,rgba(86,134,221,.26) 0%,transparent 70%); }
    .ec-orb-b { width:560px; height:560px; bottom:-200px; right:-160px; background:radial-gradient(circle,rgba(61,90,153,.28) 0%,transparent 70%); }
    .ec-bar-track { height:14px; border-radius:999px; background:rgba(255,255,255,.05); overflow:hidden; }
    .ec-bar-fill { height:100%; border-radius:999px; background:linear-gradient(90deg,var(--accent),var(--gold-soft)); }
    .ec-topbar { position:sticky; top:0; z-index:30; display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:rgba(5,7,13,.75); backdrop-filter:blur(20px); border-bottom:1px solid var(--line); }
    .ec-iconbtn { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); color:var(--text-hi); cursor:pointer; }
    .ec-drawer-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:40; opacity:0; pointer-events:none; transition:opacity .3s; }
    .ec-drawer-overlay.open { opacity:1; pointer-events:auto; }
    .ec-drawer { position:fixed; top:0; left:0; bottom:0; width:260px; z-index:50; background:var(--navy-900); border-right:1px solid var(--line); padding:18px 14px; display:flex; flex-direction:column; gap:4px; transform:translateX(-100%); transition:transform .35s; }
    .ec-drawer.open { transform:translateX(0); }
    .ec-content { position:relative; z-index:1; padding:20px 16px 60px; max-width:900px; margin:0 auto; }
    .ec-foto-thumb { border-radius:10px; object-fit:cover; background:rgba(255,255,255,.05); }
  `}</style>
);

const NAV_ITEMS = [
  { key: "suara", label: "Kotak Suara", icon: Vote },
  { key: "hasil", label: "Pemantauan Hasil", icon: BarChart3 },
  { key: "admin", label: "Panel Admin", icon: UserCog },
];

export default function App() {
  const [page, setPage] = useState("suara");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [kandidat, setKandidat] = useState([]);
  const [pakaiDemo, setPakaiDemo] = useState(false);
  const [muat, setMuat] = useState(true);

  async function refreshKandidat() {
    try { setKandidat(await api.getKandidat()); setPakaiDemo(false); }
    catch { setPakaiDemo(true); }
    finally { setMuat(false); }
  }
  useEffect(() => { refreshKandidat(); }, []);

  return (
    <div className="ec-root">
      <GlobalStyle />
      <div className="ec-orbs"><div className="ec-orb ec-orb-a" /><div className="ec-orb ec-orb-b" /></div>

      <div className="ec-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="ec-iconbtn" onClick={() => setDrawerOpen(true)}><Menu size={19} /></div>
          <div>
            <div className="ec-serif" style={{ fontSize: 15 }}>E-Voting</div>
            <div style={{ fontSize: 10.5, color: "var(--text-lo)" }}>English Community</div>
          </div>
        </div>
        {pakaiDemo && <div className="ec-badge">Mode demo</div>}
      </div>

      <div className={"ec-drawer-overlay" + (drawerOpen ? " open" : "")} onClick={() => setDrawerOpen(false)} />
      <aside className={"ec-drawer" + (drawerOpen ? " open" : "")}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px 16px" }}>
          <div className="ec-serif" style={{ fontSize: 16 }}>Menu</div>
          <div className="ec-iconbtn" onClick={() => setDrawerOpen(false)}><X size={17} /></div>
        </div>
        {NAV_ITEMS.map((item) => (
          <div key={item.key} className={"ec-navlink" + (page === item.key ? " active" : "")}
            onClick={() => { setPage(item.key); setDrawerOpen(false); }}>
            <item.icon size={17} /> {item.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <a href={WEB_UTAMA_URL} className="ec-navlink" style={{ textDecoration: "none" }}>
          <ArrowLeft size={17} /> Web Utama Eskul
        </a>
      </aside>

      <main className="ec-content ec-fade">
        {!muat && (
          <>
            {page === "suara" && <KotakSuara kandidat={kandidat} pakaiDemo={pakaiDemo} />}
            {page === "hasil" && <PemantauanHasil kandidat={kandidat} pakaiDemo={pakaiDemo} />}
            {page === "admin" && <PanelAdmin kandidat={kandidat} refreshKandidat={refreshKandidat} pakaiDemo={pakaiDemo} />}
          </>
        )}
      </main>
    </div>
  );
}

function FotoKandidat({ src, size = 44 }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div style={{ width: size, height: size, borderRadius: 10, background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-lo)", fontSize: 10, flexShrink: 0 }}>Foto</div>;
  return <img src={src} onError={() => setErr(true)} className="ec-foto-thumb" style={{ width: size, height: size }} alt="" />;
}

function KotakSuara({ kandidat, pakaiDemo }) {
  const [tahap, setTahap] = useState("token");
  const [kode, setKode] = useState("");
  const [error, setError] = useState("");
  const [pilihan, setPilihan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dibuka, setDibuka] = useState(null);

  useEffect(() => {
    if (pakaiDemo) { setDibuka(true); return; }
    api.getStatusPemilihan().then((r) => setDibuka(r.pemilihanDibuka)).catch(() => setDibuka(true));
  }, [pakaiDemo]);

  if (dibuka === null) return null;
  if (!dibuka) {
    return (
      <div style={{ maxWidth: 480, margin: "40px auto" }} className="ec-card">
        <div style={{ padding: 30, textAlign: "center" }}>
          <Lock size={28} color="var(--text-lo)" style={{ marginBottom: 10 }} />
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Kotak Suara Belum Dibuka</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5 }}>Pemilihan belum dimulai atau sudah ditutup panitia.</p>
        </div>
      </div>
    );
  }

  async function cekToken() {
    setError(""); setLoading(true);
    try { if (pakaiDemo) { setTahap("pilih"); return; } await api.verifikasiToken(kode); setTahap("pilih"); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  async function kirim() {
    setLoading(true); setError("");
    try { if (!pakaiDemo) await api.kirimSuara(kode, pilihan.id); setTahap("selesai"); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 560, margin: "10px auto" }}>
      <div className="ec-badge" style={{ marginBottom: 14 }}>Fase 1 &middot; Kotak Suara</div>
      {tahap === "token" && (
        <div className="ec-card" style={{ padding: 24 }}>
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Masukkan Token Pemilih</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5, marginBottom: 18 }}>Satu token hanya untuk satu suara.</p>
          <label className="ec-label">Kode Token</label>
          <input className="ec-input" value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())} placeholder="mis. A1B2C3" />
          {error && <div style={{ color: "#ffb0b0", fontSize: 12.5, marginTop: 8 }}>{error}</div>}
          <button className="ec-btn solid" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={cekToken} disabled={!kode || loading}><KeyRound size={15} /> Lanjutkan</button>
        </div>
      )}
      {tahap === "pilih" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 className="ec-serif" style={{ margin: 0 }}>Pilih Kandidat</h2>
          {kandidat.length === 0 && <div className="ec-card" style={{ padding: 18, color: "var(--text-lo)", fontSize: 13.5 }}>Belum ada kandidat.</div>}
          {kandidat.map((k) => (
            <div key={k.id} className="ec-card clickable" style={{ padding: 16, border: pilihan?.id === k.id ? "1px solid var(--gold)" : undefined }} onClick={() => setPilihan(k)}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <FotoKandidat src={k.fotoUrl} size={54} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>No. {k.nomorUrut} — {k.nama}</div>
                  {k.visi && <div style={{ fontSize: 12.5, color: "var(--text-lo)", marginTop: 3 }}>{k.visi}</div>}
                </div>
                {pilihan?.id === k.id && <Check size={18} color="var(--gold-soft)" />}
              </div>
            </div>
          ))}
          <button className="ec-btn solid" style={{ justifyContent: "center" }} disabled={!pilihan} onClick={() => setTahap("konfirmasi")}>Lanjut ke Konfirmasi</button>
        </div>
      )}
      {tahap === "konfirmasi" && (
        <div className="ec-card" style={{ padding: 24 }}>
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Konfirmasi Pilihan</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5 }}>Suara tidak bisa diubah setelah dikirim.</p>
          <div className="ec-card" style={{ padding: 16, margin: "16px 0", background: "rgba(255,255,255,.03)", display: "flex", gap: 12, alignItems: "center" }}>
            <FotoKandidat src={pilihan.fotoUrl} size={48} />
            <div style={{ fontWeight: 700 }}>No. {pilihan.nomorUrut} — {pilihan.nama}</div>
          </div>
          {error && <div style={{ color: "#ffb0b0", fontSize: 12.5, marginBottom: 10 }}>{error}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ec-btn ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setTahap("pilih")}>Ubah Pilihan</button>
            <button className="ec-btn solid" style={{ flex: 1, justifyContent: "center" }} onClick={kirim} disabled={loading}>Kirim Suara</button>
          </div>
        </div>
      )}
      {tahap === "selesai" && (
        <div className="ec-card" style={{ padding: 28, textAlign: "center" }}>
          <ShieldCheck size={32} color="var(--gold-soft)" style={{ marginBottom: 10 }} />
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Suara Terkirim</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5 }}>Terima kasih sudah berpartisipasi.</p>
        </div>
      )}
    </div>
  );
}

function PemantauanHasil({ kandidat, pakaiDemo }) {
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (pakaiDemo) { setHasil({ hasil: kandidat.map((k) => ({ ...k, kandidatId: k.id, jumlahSuara: 0 })), statistik: { totalPemilihTerdaftar: 0, totalSuaraMasuk: 0, partisipasiPersen: 0 } }); return; }
    const m = () => api.getHasil().then(setHasil).catch((e) => setError(e.message));
    m();
    const iv = setInterval(m, 5000);
    return () => clearInterval(iv);
  }, [pakaiDemo, kandidat]);

  if (error) return <div className="ec-card" style={{ padding: 20, color: "#ffb0b0", fontSize: 13.5 }}>{error}</div>;
  if (!hasil) return null;
  const max = Math.max(1, ...hasil.hasil.map((h) => h.jumlahSuara));
  return (
    <div style={{ maxWidth: 720, margin: "10px auto" }}>
      <div className="ec-badge" style={{ marginBottom: 14 }}>Fase 2 &middot; Pemantauan Hasil</div>
      <h2 className="ec-serif" style={{ margin: "0 0 18px" }}>Grafik Perolehan Suara</h2>
      <div className="ec-card" style={{ padding: 20, marginBottom: 16 }}>
        {hasil.hasil.length === 0 && <div style={{ color: "var(--text-lo)", fontSize: 13.5 }}>Belum ada kandidat.</div>}
        {hasil.hasil.map((h) => (
          <div key={h.kandidatId} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
              <span>No. {h.nomorUrut} — {h.nama}</span><span style={{ color: "var(--text-lo)" }}>{h.jumlahSuara} suara</span>
            </div>
            <div className="ec-bar-track"><div className="ec-bar-fill" style={{ width: `${(h.jumlahSuara / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div className="ec-card" style={{ padding: 16, flex: "1 1 140px" }}><div className="ec-label">Pemilih Terdaftar</div><div className="ec-serif" style={{ fontSize: 20 }}>{hasil.statistik.totalPemilihTerdaftar}</div></div>
        <div className="ec-card" style={{ padding: 16, flex: "1 1 140px" }}><div className="ec-label">Suara Masuk</div><div className="ec-serif" style={{ fontSize: 20 }}>{hasil.statistik.totalSuaraMasuk}</div></div>
        <div className="ec-card" style={{ padding: 16, flex: "1 1 140px" }}><div className="ec-label">Partisipasi</div><div className="ec-serif" style={{ fontSize: 20 }}>{hasil.statistik.partisipasiPersen}%</div></div>
      </div>
    </div>
  );
}

const FORM_KOSONG = { nomorUrut: "", nama: "", fotoUrl: "", visi: "", misi: "", programKerja: "" };

function FormKandidat({ awal, onSimpan, onBatal, loading }) {
  const [form, setForm] = useState(awal || FORM_KOSONG);
  const ubah = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  return (
    <div className="ec-card" style={{ padding: 18, marginBottom: 16, background: "rgba(255,255,255,.03)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 10, marginBottom: 10 }}>
        <div><label className="ec-label">No. Urut</label><input className="ec-input" value={form.nomorUrut} onChange={ubah("nomorUrut")} placeholder="1" /></div>
        <div><label className="ec-label">Nama Kandidat</label><input className="ec-input" value={form.nama} onChange={ubah("nama")} placeholder="Nama lengkap" /></div>
      </div>
      <div style={{ marginBottom: 10 }}><label className="ec-label">Link Foto/Poster (URL gambar)</label><input className="ec-input" value={form.fotoUrl} onChange={ubah("fotoUrl")} placeholder="https://..." /></div>
      <div style={{ marginBottom: 10 }}><label className="ec-label">Visi</label><textarea className="ec-textarea" value={form.visi} onChange={ubah("visi")} placeholder="Visi kandidat" /></div>
      <div style={{ marginBottom: 10 }}><label className="ec-label">Misi (satu baris = satu poin)</label><textarea className="ec-textarea" value={form.misi} onChange={ubah("misi")} placeholder={"Misi 1\nMisi 2"} /></div>
      <div style={{ marginBottom: 14 }}><label className="ec-label">Program Kerja (satu baris = satu poin)</label><textarea className="ec-textarea" value={form.programKerja} onChange={ubah("programKerja")} placeholder={"Program 1\nProgram 2"} /></div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="ec-btn ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onBatal}>Batal</button>
        <button className="ec-btn solid" style={{ flex: 1, justifyContent: "center" }} disabled={!form.nama || loading} onClick={() => onSimpan(form)}>{loading ? "Menyimpan..." : "Simpan"}</button>
      </div>
    </div>
  );
}

function PanelAdmin({ kandidat, refreshKandidat, pakaiDemo }) {
  const [masuk, setMasuk] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [tab, setTab] = useState("kandidat");

  async function login() {
    setErrorLogin("");
    if (pakaiDemo) { setMasuk(true); return; }
    try { await api.getSemuaToken(adminKey); setMasuk(true); }
    catch (e) { setErrorLogin(e.message || "Admin key salah, atau server tidak bisa dihubungi."); }
  }

  if (!masuk) {
    return (
      <div style={{ maxWidth: 380, margin: "40px auto" }} className="ec-card">
        <div style={{ padding: 26 }}>
          <Lock size={20} color="var(--gold-soft)" />
          <h2 className="ec-serif" style={{ margin: "10px 0 14px" }}>Masuk Admin</h2>
          <label className="ec-label">Admin Key</label>
          <input className="ec-input" type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} />
          {errorLogin && <div style={{ color: "#ffb0b0", fontSize: 12.5, marginTop: 8 }}>{errorLogin}</div>}
          <button className="ec-btn solid" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={login}>Masuk</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="ec-badge">Panel Admin</div>
        <button className="ec-btn ghost" onClick={() => setMasuk(false)}><LogOut size={14} /> Keluar</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button className={"ec-btn" + (tab === "kandidat" ? " solid" : " ghost")} onClick={() => setTab("kandidat")}><Users size={14} /> Kandidat</button>
        <button className={"ec-btn" + (tab === "token" ? " solid" : " ghost")} onClick={() => setTab("token")}><KeyRound size={14} /> Token</button>
        <button className={"ec-btn" + (tab === "kunci" ? " solid" : " ghost")} onClick={() => setTab("kunci")}><Lock size={14} /> Kunci</button>
      </div>
      {tab === "kandidat" && <TabKandidat kandidat={kandidat} refreshKandidat={refreshKandidat} pakaiDemo={pakaiDemo} adminKey={adminKey} />}
      {tab === "token" && <TabToken pakaiDemo={pakaiDemo} adminKey={adminKey} />}
      {tab === "kunci" && <TabKunci pakaiDemo={pakaiDemo} adminKey={adminKey} />}
    </div>
  );
}

function TabKandidat({ kandidat, refreshKandidat, pakaiDemo, adminKey }) {
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bariskan = (t) => String(t || "").split("\n").map((s) => s.trim()).filter(Boolean);

  async function simpan(form) {
    setLoading(true); setError("");
    const payload = { nomorUrut: Number(form.nomorUrut) || kandidat.length + 1, nama: form.nama, fotoUrl: form.fotoUrl, visi: form.visi, misi: bariskan(form.misi), programKerja: bariskan(form.programKerja) };
    try {
      if (pakaiDemo) { setError("Backend belum konek — perubahan tidak permanen."); }
      else if (editId) { await api.editKandidat(adminKey, editId, payload); }
      else { await api.tambahKandidat(adminKey, payload); }
      await refreshKandidat();
      setFormTerbuka(false); setEditId(null);
    } catch (e) { setError(e.message || "Gagal menyimpan kandidat."); }
    finally { setLoading(false); }
  }
  async function hapus(id) {
    setError("");
    try { if (!pakaiDemo) await api.hapusKandidat(adminKey, id); await refreshKandidat(); }
    catch (e) { setError(e.message || "Gagal menghapus kandidat."); }
  }
  function bukaEdit(k) { setEditId(k.id); setFormTerbuka(true); setError(""); }

  const dataEdit = editId ? kandidat.find((k) => k.id === editId) : null;
  const formAwal = dataEdit ? { nomorUrut: String(dataEdit.nomorUrut || ""), nama: dataEdit.nama || "", fotoUrl: dataEdit.fotoUrl || "", visi: dataEdit.visi || "", misi: (dataEdit.misi || []).join("\n"), programKerja: (dataEdit.programKerja || []).join("\n") } : null;

  return (
    <div className="ec-card" style={{ padding: 18 }}>
      {error && <div style={{ color: "#ffb0b0", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
      {!formTerbuka && <button className="ec-btn solid" style={{ marginBottom: 16 }} onClick={() => { setEditId(null); setFormTerbuka(true); }}><Plus size={15} /> Tambah Kandidat</button>}
      {formTerbuka && <FormKandidat awal={formAwal} loading={loading} onSimpan={simpan} onBatal={() => { setFormTerbuka(false); setEditId(null); setError(""); }} />}
      {kandidat.length === 0 && !formTerbuka && <div style={{ color: "var(--text-lo)", fontSize: 13.5, textAlign: "center", padding: 20 }}>Belum ada kandidat.</div>}
      {kandidat.map((k) => (
        <div key={k.id} className="ec-card" style={{ padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
          <FotoKandidat src={k.fotoUrl} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}>No. {k.nomorUrut} — {k.nama}</div>
            {k.visi && <div style={{ fontSize: 12, color: "var(--text-lo)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.visi}</div>}
          </div>
          <button className="ec-btn ghost" onClick={() => bukaEdit(k)}><Pencil size={13} /></button>
          <button className="ec-btn danger" onClick={() => hapus(k.id)}><Trash2 size={13} /></button>
        </div>
      ))}
    </div>
  );
}

function TabToken({ pakaiDemo, adminKey }) {
  const [token, setToken] = useState([]);
  const [jumlahGenInput, setJumlahGenInput] = useState("10");
  const [error, setError] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  async function muatToken() { if (pakaiDemo) return; try { setToken(await api.getSemuaToken(adminKey)); } catch (e) { setError(e.message); } }
  useEffect(() => { muatToken(); }, []); // eslint-disable-line

  async function generate() {
    setError(""); setPesan(""); setLoading(true);
    const jumlah = Math.max(1, parseInt(jumlahGenInput, 10) || 1);
    try {
      if (pakaiDemo) {
        const baru = Array.from({ length: jumlah }, (_, i) => ({ kode: Math.random().toString(36).slice(2, 8).toUpperCase() + i, dipakai: false }));
        setToken((p) => [...p, ...baru]);
        setPesan(`${jumlah} token dibuat (mode demo, tidak permanen).`);
      } else {
        const baru = await api.generateToken(adminKey, jumlah);
        setToken((p) => [...p, ...baru]);
        setPesan(`${baru.length} token berhasil dibuat.`);
      }
    } catch (e) { setError(e.message || "Gagal membuat token."); }
    finally { setLoading(false); }
  }

  async function importFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setPesan(""); setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const kodeList = rows.map((r) => String(r[0] ?? "").trim()).filter((v) => v && !/^(kode|token)$/i.test(v));
      if (kodeList.length === 0) throw new Error("File tidak berisi data token yang valid di kolom pertama.");
      if (pakaiDemo) {
        setToken((p) => [...p, ...kodeList.map((k) => ({ kode: k.toUpperCase(), dipakai: false }))]);
        setPesan(`${kodeList.length} token dari file dimuat (mode demo).`);
      } else {
        const r = await api.importToken(adminKey, kodeList);
        await muatToken();
        setPesan(`${r.totalDitambah} token berhasil diimpor. ${r.totalDilewati} dilewati (duplikat).`);
      }
    } catch (e) { setError(e.message || "Gagal membaca file."); }
    finally { setLoading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  return (
    <div className="ec-card" style={{ padding: 18 }}>
      {error && <div style={{ color: "#ffb0b0", fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
      {pesan && <div style={{ color: "var(--gold-soft)", fontSize: 12.5, marginBottom: 12 }}>{pesan}</div>}
      <div style={{ marginBottom: 18 }}>
        <label className="ec-label">Buat Token Otomatis</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="ec-input" style={{ flex: 1 }} inputMode="numeric" value={jumlahGenInput} onChange={(e) => setJumlahGenInput(e.target.value.replace(/[^0-9]/g, ""))} placeholder="Jumlah" />
          <button className="ec-btn solid" onClick={generate} disabled={loading}><Plus size={15} /> Buat</button>
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label className="ec-label">Import dari Excel/CSV</label>
        <p style={{ fontSize: 12, color: "var(--text-lo)", marginBottom: 8 }}>Kolom pertama file diisi daftar kode token, satu kode per baris.</p>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={importFile} disabled={loading} style={{ fontSize: 12.5, color: "var(--text-lo)" }} />
      </div>
      <table className="ec-table">
        <thead><tr><th>Kode</th><th>Status</th></tr></thead>
        <tbody>{token.map((t, i) => (<tr key={t.kode + "-" + i}><td>{t.kode}</td><td>{t.dipakai ? "Sudah dipakai" : "Belum dipakai"}</td></tr>))}</tbody>
      </table>
      {token.length === 0 && <div style={{ color: "var(--text-lo)", fontSize: 13, textAlign: "center", padding: 16 }}>Belum ada token.</div>}
    </div>
  );
}

function TabKunci({ pakaiDemo, adminKey }) {
  const [dibuka, setDibuka] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function muat() {
    setError("");
    try { const r = pakaiDemo ? { pemilihanDibuka: true } : await api.getStatusPemilihan(); setDibuka(r.pemilihanDibuka); }
    catch (e) { setError(e.message || "Gagal mengambil status."); }
  }
  useEffect(() => { muat(); }, []); // eslint-disable-line

  async function toggle() {
    setError(""); setLoading(true);
    const target = !dibuka;
    try {
      if (pakaiDemo) { setDibuka(target); }
      else { const r = await api.setPemilihanStatus(adminKey, target); setDibuka(r.pemilihanDibuka); }
    } catch (e) { setError(e.message || "Gagal mengubah status."); }
    finally { setLoading(false); }
  }

  if (dibuka === null && !error) return null;
  return (
    <div className="ec-card" style={{ padding: 26, textAlign: "center" }}>
      {error && <div style={{ color: "#ffb0b0", fontSize: 12.5, marginBottom: 14 }}>{error}</div>}
      {dibuka !== null && (
        <>
          {dibuka ? <Unlock size={28} color="var(--gold-soft)" style={{ marginBottom: 10 }} /> : <Lock size={28} color="var(--text-lo)" style={{ marginBottom: 10 }} />}
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Pemilihan sedang {dibuka ? "DIBUKA" : "DIKUNCI"}</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5, marginBottom: 18 }}>{dibuka ? "Voter bisa masuk ke Kotak Suara sekarang." : "Buka pas hari-H, kunci lagi setelah selesai."}</p>
          <button className={"ec-btn " + (dibuka ? "danger" : "solid")} onClick={toggle} disabled={loading}>{dibuka ? <><Lock size={15} /> Kunci Sekarang</> : <><Unlock size={15} /> Buka Sekarang</>}</button>
        </>
      )}
      <div style={{ marginTop: 16 }}><button className="ec-btn ghost" onClick={muat}>Muat Ulang Status</button></div>
    </div>
  );
}
