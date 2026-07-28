/**
 * ---------------------------------------------------------------
 *  Lapisan API — semua komunikasi ke backend e-voting lewat sini.
 *  Ganti API_BASE ke alamat backend lo (localhost pas dev, atau
 *  domain asli pas sudah di-deploy, mis. https://api.evoting.namaeskul.com)
 * ---------------------------------------------------------------
 */
export const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.alasan || "Terjadi kesalahan pada server.");
  return data;
}

/* ---------- Publik (dipakai di halaman voter) ---------- */
export const getKandidat = () => request("/api/kandidat");
export const verifikasiToken = (kode) =>
  request("/api/token/verifikasi", { method: "POST", body: JSON.stringify({ kode }) });
export const kirimSuara = (kode, kandidatId) =>
  request("/api/suara", { method: "POST", body: JSON.stringify({ kode, kandidatId }) });
export const getHasil = () => request("/api/hasil");
export const getStatusPemilihan = () => request("/api/pemilihan/status");

/* ---------- Admin (butuh adminKey) ---------- */
export const tambahKandidat = (adminKey, kandidat) =>
  request("/api/kandidat", {
    method: "POST",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify(kandidat),
  });
export const editKandidat = (adminKey, id, patch) =>
  request(`/api/kandidat/${id}`, {
    method: "PUT",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify(patch),
  });
export const hapusKandidat = (adminKey, id) =>
  request(`/api/kandidat/${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });

export const generateToken = (adminKey, jumlah) =>
  request("/api/token/generate", {
    method: "POST",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify({ jumlah }),
  });
export const importToken = (adminKey, kode) =>
  request("/api/token/import", {
    method: "POST",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify({ kode }),
  });
export const getSemuaToken = (adminKey) =>
  request("/api/token", { headers: { "x-admin-key": adminKey } });

export const setPemilihanStatus = (adminKey, dibuka) =>
  request("/api/pemilihan/status", {
    method: "POST",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify({ dibuka }),
  });
