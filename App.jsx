import React, { useState, useEffect } from "react";
import {
  Vote, BarChart3, UserCog, KeyRound, Lock, LogOut, Plus, Trash2,
  Pencil, Download, Check, ArrowLeft, ShieldCheck, Users, Menu, Unlock,
} from "lucide-react";
import * as api from "./api";

/* ---------------------------------------------------------
   Link balik ke web eskul utama — ganti ke domain asli lo
--------------------------------------------------------- */
const WEB_UTAMA_URL = "https://englishcommunity.example.com";

/* ---------------------------------------------------------
   STYLE — dicopy 1:1 dari design system App.jsx eskul,
   supaya dua web kerasa satu ekosistem.
--------------------------------------------------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    .ec-root {
      --navy-950: #05070d; --navy-900: #090d17; --navy-800: #0f1522;
      --navy-700: #161e30; --navy-600: #2a3752; --line: rgba(140,170,255,.09);
      --gold: #5686dd; --gold-soft: #93b6ee; --accent: #3d5a99;
      --text-hi: #f2f5fa; --text-lo: #8792a8;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--navy-950); color: var(--text-hi);
      min-height: 100vh; -webkit-font-smoothing: antialiased; line-height: 1.5;
    }
    .ec-serif { font-family: 'Outfit', sans-serif; font-weight: 700; letter-spacing: -.02em; }
    .ec-fade { animation: ecFadeIn .5s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes ecFadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
    .ec-card {
      background: rgba(255,255,255,.02); backdrop-filter: blur(32px) saturate(180%);
      -webkit-backdrop-filter: blur(32px) saturate(180%); border: 1px solid rgba(255,255,255,.06);
      border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
      transition: all .4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ec-card:hover { background: rgba(255,255,255,.035); border-color: rgba(255,255,255,.12); }
    .ec-card.clickable { cursor: pointer; }
    .ec-card.clickable:hover { border-color: rgba(86,134,221,.45); transform: translateY(-3px); box-shadow: 0 20px 46px rgba(0,0,0,.45), 0 0 0 1px rgba(86,134,221,.08); }
    .ec-navlink {
      display: flex; align-items: center; gap: 11px; padding: 10px 13px; border-radius: 12px;
      color: var(--text-lo); cursor: pointer; border-left: 2px solid transparent;
      transition: all .35s cubic-bezier(0.16, 1, 0.3, 1); font-size: 13.5px; font-weight: 500;
    }
    .ec-navlink:hover { background: rgba(255,255,255,.045); color: var(--text-hi); }
    .ec-navlink.active {
      background: linear-gradient(135deg, rgba(86,134,221,.14), rgba(255,255,255,.03));
      border-left: 2px solid var(--gold); color: var(--text-hi);
    }
    .ec-btn {
      display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 12px;
      font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.025); color: var(--text-hi);
      backdrop-filter: blur(16px); transition: all .35s cubic-bezier(0.16, 1, 0.3, 1); white-space: nowrap;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .ec-btn:hover { border-color: rgba(255,255,255,.18); background: rgba(255,255,255,.06); transform: translateY(-2px); }
    .ec-btn.solid { background: var(--text-hi); color: var(--navy-950); border-color: var(--text-hi); }
    .ec-btn.solid:hover { background: var(--gold-soft); border-color: var(--gold-soft); }
    .ec-btn.danger { color: #d99a9a; }
    .ec-btn.danger:hover { background: rgba(180,60,60,.22); border-color: #7a3a3a; color: #ffb0b0; }
    .ec-btn.ghost { color: var(--text-lo); }
    .ec-btn:disabled { opacity: .4; cursor: not-allowed; transform: none !important; }
    .ec-input {
      width: 100%; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07);
      color: var(--text-hi); border-radius: 12px; padding: 10px 13px; font-size: 13.5px; outline: none;
      transition: all .3s ease; font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .ec-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(86,134,221,.12); }
    .ec-label { font-size: 11px; text-transform: uppercase; letter-spacing: .8px; font-weight: 600; color: var(--text-lo); margin-bottom: 6px; display: block; }
    .ec-badge {
      display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; letter-spacing: .4px;
      text-transform: uppercase; font-weight: 600; color: var(--text-lo); background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.06); border-radius: 999px; padding: 6px 12px;
    }
    .ec-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .ec-table th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: .6px; font-weight: 700; color: var(--text-lo); padding: 12px 14px; border-bottom: 1px solid var(--line); }
    .ec-table td { padding: 12px 14px; border-bottom: 1px solid var(--line); }
    .ec-table tr:hover td { background: rgba(255,255,255,.025); }
    .ec-orbs { position: fixed; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; background: radial-gradient(ellipse at top, #090d17 0%, #05070d 60%); }
    .ec-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
    .ec-orb-a { width: 520px; height: 520px; top: -160px; left: -140px; background: radial-gradient(circle, rgba(86,134,221,.26) 0%, transparent 70%); animation: ecFloat 18s ease-in-out infinite; }
    .ec-orb-b { width: 560px; height: 560px; bottom: -200px; right: -160px; background: radial-gradient(circle, rgba(61,90,153,.28) 0%, transparent 70%); animation: ecFloat 22s ease-in-out infinite reverse; }
    @keyframes ecFloat { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(30px,-30px) scale(1.08);} }
    .ec-shell { position: relative; z-index: 1; display: flex; min-height: 100vh; gap: 16px; padding: 16px; }
    .ec-sidebar {
      width: 250px; flex-shrink: 0; border-radius: 22px; position: sticky; top: 16px; height: calc(100vh - 32px);
      background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.07);
      backdrop-filter: blur(36px) saturate(180%); padding: 22px 16px; display: flex; flex-direction: column; gap: 4px;
    }
    .ec-bar-track { height: 14px; border-radius: 999px; background: rgba(255,255,255,.05); overflow: hidden; }
    .ec-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--accent), var(--gold-soft)); transition: width .6s cubic-bezier(0.16,1,0.3,1); }
    @media (max-width: 860px) { .ec-shell { padding: 12px; flex-direction: column; } .ec-sidebar { width: 100%; height: auto; position: static; flex-direction: row; overflow-x: auto; } }
  `}</style>
);

/* ---------------------------------------------------------
   DATA DEMO — dipakai kalau backend belum jalan, biar
   tetap kelihatan wujud UI-nya pas dipreview.
--------------------------------------------------------- */
const DEMO_KANDIDAT = [
  { id: "demo-1", nomorUrut: 1, nama: "Kandidat Contoh A", visi: "Membawa English Community lebih aktif dan inklusif." },
  { id: "demo-2", nomorUrut: 2, nama: "Kandidat Contoh B", visi: "Fokus pada program latihan rutin dan kompetisi." },
];

export default function App() {
  const [page, setPage] = useState("suara"); // suara | hasil | admin
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kandidat, setKandidat] = useState(DEMO_KANDIDAT);
  const [pakaiDemo, setPakaiDemo] = useState(false);

  useEffect(() => {
    api.getKandidat().then(setKandidat).catch(() => setPakaiDemo(true));
  }, []);

  return (
    <div className="ec-root">
      <GlobalStyle />
      <div className="ec-orbs"><div className="ec-orb ec-orb-a" /><div className="ec-orb ec-orb-b" /></div>
      <div className="ec-shell">
        <aside className="ec-sidebar">
          <div style={{ padding: "6px 10px 18px" }}>
            <div className="ec-serif" style={{ fontSize: 17 }}>E-Voting</div>
            <div style={{ fontSize: 11.5, color: "var(--text-lo)" }}>English Community</div>
          </div>
          <div className={"ec-navlink" + (page === "suara" ? " active" : "")} onClick={() => setPage("suara")}>
            <Vote size={16} /> Kotak Suara
          </div>
          <div className={"ec-navlink" + (page === "hasil" ? " active" : "")} onClick={() => setPage("hasil")}>
            <BarChart3 size={16} /> Pemantauan Hasil
          </div>
          <div className={"ec-navlink" + (page === "admin" ? " active" : "")} onClick={() => setPage("admin")}>
            <UserCog size={16} /> Panel Admin
          </div>
          <div style={{ flex: 1 }} />
          <a href={WEB_UTAMA_URL} className="ec-navlink" style={{ textDecoration: "none" }}>
            <ArrowLeft size={16} /> Web Utama Eskul
          </a>
          {pakaiDemo && (
            <div className="ec-badge" style={{ marginTop: 8 }}>Mode demo — backend belum konek</div>
          )}
        </aside>

        <main style={{ flex: 1, minWidth: 0 }} className="ec-fade">
          {page === "suara" && <KotakSuara kandidat={kandidat} pakaiDemo={pakaiDemo} />}
          {page === "hasil" && <PemantauanHasil kandidat={kandidat} pakaiDemo={pakaiDemo} />}
          {page === "admin" && <PanelAdmin kandidat={kandidat} setKandidat={setKandidat} pakaiDemo={pakaiDemo} />}
        </main>
      </div>
    </div>
  );
}

/* ===================== FASE 1 — KOTAK SUARA ===================== */
function KotakSuara({ kandidat, pakaiDemo }) {
  const [tahap, setTahap] = useState("token"); // token | pilih | konfirmasi | selesai
  const [kode, setKode] = useState("");
  const [error, setError] = useState("");
  const [pilihan, setPilihan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dibuka, setDibuka] = useState(null); // null = lagi dicek

  useEffect(() => {
    if (pakaiDemo) { setDibuka(true); return; }
    api.getStatusPemilihan().then((r) => setDibuka(r.pemilihanDibuka)).catch(() => setDibuka(true));
  }, [pakaiDemo]);

  if (dibuka === null) return null;

  if (!dibuka) {
    return (
      <div style={{ maxWidth: 480, margin: "80px auto" }} className="ec-card">
        <div style={{ padding: 30, textAlign: "center" }}>
          <Lock size={28} color="var(--text-lo)" style={{ marginBottom: 10 }} />
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Kotak Suara Belum Dibuka</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5 }}>
            Pemilihan belum dimulai atau sudah ditutup panitia. Coba cek lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  async function cekToken() {
    setError(""); setLoading(true);
    try {
      if (pakaiDemo) { setTahap("pilih"); return; }
      await api.verifikasiToken(kode);
      setTahap("pilih");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function kirim() {
    setLoading(true); setError("");
    try {
      if (!pakaiDemo) await api.kirimSuara(kode, pilihan.id);
      setTahap("selesai");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 560, margin: "40px auto" }}>
      <div className="ec-badge" style={{ marginBottom: 14 }}>Fase 1 · Kotak Suara</div>

      {tahap === "token" && (
        <div className="ec-card" style={{ padding: 28 }}>
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Masukkan Token Pemilih</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5, marginBottom: 18 }}>
            Token dikirim oleh panitia. Satu token hanya berlaku untuk satu suara.
          </p>
          <label className="ec-label">Kode Token</label>
          <input className="ec-input" value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())} placeholder="mis. A1B2C3" />
          {error && <div style={{ color: "#ffb0b0", fontSize: 12.5, marginTop: 8 }}>{error}</div>}
          <button className="ec-btn solid" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={cekToken} disabled={!kode || loading}>
            <KeyRound size={15} /> Lanjutkan
          </button>
        </div>
      )}

      {tahap === "pilih" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 className="ec-serif" style={{ margin: 0 }}>Pilih Kandidat</h2>
          {kandidat.map((k) => (
            <div key={k.id} className={"ec-card clickable"} style={{ padding: 18, border: pilihan?.id === k.id ? "1px solid var(--gold)" : undefined }} onClick={() => setPilihan(k)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>No. {k.nomorUrut} — {k.nama}</div>
                  <div style={{ fontSize: 13, color: "var(--text-lo)", marginTop: 4 }}>{k.visi}</div>
                </div>
                {pilihan?.id === k.id && <Check size={18} color="var(--gold-soft)" />}
              </div>
            </div>
          ))}
          <button className="ec-btn solid" style={{ justifyContent: "center" }} disabled={!pilihan} onClick={() => setTahap("konfirmasi")}>
            Lanjut ke Konfirmasi
          </button>
        </div>
      )}

      {tahap === "konfirmasi" && (
        <div className="ec-card" style={{ padding: 28 }}>
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>Konfirmasi Pilihan</h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5 }}>Suara tidak bisa diubah setelah dikirim.</p>
          <div className="ec-card" style={{ padding: 16, margin: "16px 0", background: "rgba(255,255,255,.03)" }}>
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
          <p style={{ color: "var(--text-lo)", fontSize: 13.5 }}>Terima kasih sudah berpartisipasi dalam pemilihan.</p>
        </div>
      )}
    </div>
  );
}

/* ===================== FASE 2 — PEMANTAUAN HASIL ===================== */
function PemantauanHasil({ kandidat, pakaiDemo }) {
  const [hasil, setHasil] = useState(null);

  useEffect(() => {
    if (pakaiDemo) {
      setHasil({
        hasil: kandidat.map((k, i) => ({ ...k, kandidatId: k.id, jumlahSuara: i === 0 ? 18 : 12 })),
        statistik: { totalPemilihTerdaftar: 40, totalSuaraMasuk: 30, partisipasiPersen: 75 },
      });
      return;
    }
    api.getHasil().then(setHasil).catch(() => {});
    const iv = setInterval(() => api.getHasil().then(setHasil).catch(() => {}), 5000);
    return () => clearInterval(iv);
  }, [pakaiDemo, kandidat]);

  if (!hasil) return null;
  const max = Math.max(1, ...hasil.hasil.map((h) => h.jumlahSuara));

  return (
    <div style={{ maxWidth: 720, margin: "40px auto" }}>
      <div className="ec-badge" style={{ marginBottom: 14 }}>Fase 2 · Pemantauan Hasil</div>
      <h2 className="ec-serif" style={{ margin: "0 0 18px" }}>Grafik Perolehan Suara</h2>

      <div className="ec-card" style={{ padding: 22, marginBottom: 16 }}>
        {hasil.hasil.map((h) => (
          <div key={h.kandidatId} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
              <span>No. {h.nomorUrut} — {h.nama}</span>
              <span style={{ color: "var(--text-lo)" }}>{h.jumlahSuara} suara</span>
            </div>
            <div className="ec-bar-track"><div className="ec-bar-fill" style={{ width: `${(h.jumlahSuara / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div className="ec-card" style={{ padding: 18, flex: 1 }}>
          <div className="ec-label">Pemilih Terdaftar</div>
          <div className="ec-serif" style={{ fontSize: 22 }}>{hasil.statistik.totalPemilihTerdaftar}</div>
        </div>
        <div className="ec-card" style={{ padding: 18, flex: 1 }}>
          <div className="ec-label">Suara Masuk</div>
          <div className="ec-serif" style={{ fontSize: 22 }}>{hasil.statistik.totalSuaraMasuk}</div>
        </div>
        <div className="ec-card" style={{ padding: 18, flex: 1 }}>
          <div className="ec-label">Partisipasi</div>
          <div className="ec-serif" style={{ fontSize: 22 }}>{hasil.statistik.partisipasiPersen}%</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== FASE 2/3 — PANEL ADMIN (Kandidat + Token) ===================== */
function PanelAdmin({ kandidat, setKandidat, pakaiDemo }) {
  const [masuk, setMasuk] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [tab, setTab] = useState("kandidat"); // kandidat | token | kunci
  const [namaBaru, setNamaBaru] = useState("");
  const [token, setToken] = useState([]);
  const [jumlahGen, setJumlahGen] = useState(10);
  const [dibuka, setDibuka] = useState(false);

  useEffect(() => {
    if (!masuk) return;
    if (pakaiDemo) return;
    api.getStatusPemilihan().then((r) => setDibuka(r.pemilihanDibuka)).catch(() => {});
  }, [masuk, pakaiDemo]);

  async function toggleKunci() {
    const baru = !dibuka;
    if (pakaiDemo) { setDibuka(baru); return; }
    const r = await api.setPemilihanStatus(adminKey, baru);
    setDibuka(r.pemilihanDibuka);
  }

  async function login() {
    if (pakaiDemo) { setMasuk(true); return; }
    try {
      await api.getSemuaToken(adminKey); // dipakai sekaligus buat validasi key
      setMasuk(true);
    } catch { alert("Admin key salah."); }
  }

  async function tambah() {
    if (!namaBaru) return;
    if (pakaiDemo) {
      setKandidat([...kandidat, { id: `demo-${Date.now()}`, nomorUrut: kandidat.length + 1, nama: namaBaru, visi: "" }]);
    } else {
      const baru = await api.tambahKandidat(adminKey, { nama: namaBaru, nomorUrut: kandidat.length + 1 });
      setKandidat([...kandidat, baru]);
    }
    setNamaBaru("");
  }

  async function hapus(id) {
    if (pakaiDemo) { setKandidat(kandidat.filter((k) => k.id !== id)); return; }
    await api.hapusKandidat(adminKey, id);
    setKandidat(kandidat.filter((k) => k.id !== id));
  }

  async function generate() {
    if (pakaiDemo) {
      const baru = Array.from({ length: jumlahGen }, () => ({ kode: Math.random().toString(36).slice(2, 8).toUpperCase(), dipakai: false }));
      setToken([...token, ...baru]);
      return;
    }
    const baru = await api.generateToken(adminKey, jumlahGen);
    setToken([...token, ...baru]);
  }

  if (!masuk) {
    return (
      <div style={{ maxWidth: 380, margin: "80px auto" }} className="ec-card">
        <div style={{ padding: 26 }}>
          <Lock size={20} color="var(--gold-soft)" />
          <h2 className="ec-serif" style={{ margin: "10px 0 14px" }}>Masuk Admin</h2>
          <label className="ec-label">Admin Key</label>
          <input className="ec-input" type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} />
          <button className="ec-btn solid" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={login}>Masuk</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="ec-badge">Panel Admin</div>
        <button className="ec-btn ghost" onClick={() => setMasuk(false)}><LogOut size={14} /> Keluar</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button className={"ec-btn" + (tab === "kandidat" ? " solid" : " ghost")} onClick={() => setTab("kandidat")}><Users size={14} /> Manajemen Kandidat</button>
        <button className={"ec-btn" + (tab === "token" ? " solid" : " ghost")} onClick={() => setTab("token")}><KeyRound size={14} /> Kelola Token</button>
        <button className={"ec-btn" + (tab === "kunci" ? " solid" : " ghost")} onClick={() => setTab("kunci")}>{dibuka ? <Unlock size={14} /> : <Lock size={14} />} Kunci Pemilihan</button>
      </div>

      {tab === "kandidat" && (
        <div className="ec-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input className="ec-input" placeholder="Nama kandidat baru" value={namaBaru} onChange={(e) => setNamaBaru(e.target.value)} />
            <button className="ec-btn solid" onClick={tambah}><Plus size={15} /> Tambah</button>
          </div>
          <table className="ec-table">
            <thead><tr><th>No.</th><th>Nama</th><th></th></tr></thead>
            <tbody>
              {kandidat.map((k) => (
                <tr key={k.id}>
                  <td>{k.nomorUrut}</td>
                  <td>{k.nama}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="ec-btn danger" onClick={() => hapus(k.id)}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "kunci" && (
        <div className="ec-card" style={{ padding: 26, textAlign: "center" }}>
          {dibuka
            ? <Unlock size={28} color="var(--gold-soft)" style={{ marginBottom: 10 }} />
            : <Lock size={28} color="var(--text-lo)" style={{ marginBottom: 10 }} />}
          <h2 className="ec-serif" style={{ margin: "0 0 6px" }}>
            Pemilihan sedang {dibuka ? "DIBUKA" : "DIKUNCI"}
          </h2>
          <p style={{ color: "var(--text-lo)", fontSize: 13.5, marginBottom: 18 }}>
            {dibuka
              ? "Voter bisa masuk ke Kotak Suara dan mengirim suara sekarang."
              : "Kotak Suara ditutup. Buka pas hari-H pemilihan, lalu kunci lagi setelah selesai."}
          </p>
          <button className={"ec-btn " + (dibuka ? "danger" : "solid")} onClick={toggleKunci}>
            {dibuka ? <><Lock size={15} /> Kunci Sekarang</> : <><Unlock size={15} /> Buka Sekarang</>}
          </button>
        </div>
      )}

      {tab === "token" && (
        <div className="ec-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label className="ec-label">Jumlah Token</label>
              <input className="ec-input" type="number" value={jumlahGen} onChange={(e) => setJumlahGen(Number(e.target.value))} />
            </div>
            <button className="ec-btn solid" onClick={generate}><Plus size={15} /> Buat Token Massal</button>
            <button className="ec-btn ghost" onClick={() => {
              const csv = "kode,status\n" + token.map((t) => `${t.kode},${t.dipakai ? "dipakai" : "belum"}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob); a.download = "token-pemilih.csv"; a.click();
            }}><Download size={15} /> Ekspor</button>
          </div>
          <table className="ec-table">
            <thead><tr><th>Kode</th><th>Status</th></tr></thead>
            <tbody>
              {token.map((t) => (
                <tr key={t.kode}><td>{t.kode}</td><td>{t.dipakai ? "Sudah dipakai" : "Belum dipakai"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
