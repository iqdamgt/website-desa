# Panduan Setup Admin — Website Desa Semparuk

Sistem ini terdiri dari 2 bagian:
1. **Backend** — Google Sheets + Google Apps Script (gratis, jadi "database" dan API).
2. **Frontend** — file HTML/CSS/JS yang sama seperti sekarang, ditambah halaman admin.

Website tetap 100% statis (bisa di-hosting di mana saja yang gratis), tapi datanya bisa diubah dari dashboard admin tanpa perlu edit kode.

---

## Langkah 1 — Siapkan Google Sheet

1. Buka [sheets.google.com](https://sheets.google.com), buat spreadsheet baru.
   - Jika Anda **sudah punya** Google Sheet untuk fitur ulasan sebelumnya, pakai sheet yang sama itu saja (lanjut ke Langkah 2).
2. Beri nama misalnya "Database Website Desa Semparuk".

Anda **tidak perlu** membuat tab/sheet secara manual — kode di Langkah 2 akan otomatis membuat tab `Reviews` dan `Content` saat pertama kali dipakai.

## Langkah 2 — Pasang kode Apps Script

1. Di Google Sheet, klik **Extensions → Apps Script**.
2. Hapus semua kode default yang ada di editor.
3. Buka file **`Code.gs`** dari folder ini, salin seluruh isinya, tempel ke editor Apps Script.
4. Klik ikon simpan (💾).

## Langkah 3 — Atur password admin

1. Masih di editor Apps Script, cari fungsi paling bawah bernama `setAdminPassword()`.
2. Ganti tulisan `'GANTI_PASSWORD_INI'` dengan password pilihan Anda, contoh: `'DesaSemparuk2026!'`.
3. Di dropdown pemilih fungsi (bagian atas editor), pilih **setAdminPassword**, lalu klik tombol **▶ Run**.
4. Google akan minta izin akses pertama kali — klik **Review permissions**, pilih akun Anda, klik **Advanced → Buka (nama project) (unsafe)** → **Allow**. Ini wajar karena ini script milik Anda sendiri.
5. Setelah selesai jalan (lihat centang hijau di log), password admin sudah aktif.
   - *(Opsional, demi keamanan)*: kembalikan isi variabel `password` ke `'GANTI_PASSWORD_INI'` lagi setelah selesai, supaya password asli tidak tersimpan di kode.

## Langkah 4 — Deploy sebagai Web App

1. Klik tombol **Deploy → New deployment**.
2. Klik ikon gerigi ⚙️ di samping "Select type", pilih **Web app**.
3. Isi:
   - **Execute as**: Me (akun Anda)
   - **Who has access**: **Anyone**
4. Klik **Deploy**.
5. Salin **Web app URL** yang muncul (bentuknya seperti `https://script.google.com/macros/s/xxxxx/exec`).

> Jika sebelumnya Anda sudah punya deployment untuk fitur ulasan, gunakan **Manage deployments → Edit (pensil) → New version → Deploy** supaya URL-nya tetap sama dan tidak perlu ganti di `config.js`.

## Langkah 5 — Hubungkan website ke Apps Script

1. Buka file **`config.js`** di folder website.
2. Ganti nilai `GOOGLE_SCRIPT_URL` dengan URL yang Anda salin di Langkah 4.
3. Simpan file.

## Langkah 6 — Upload ke hosting

Upload **semua file** di folder ini (termasuk `Code.gs` tidak perlu diupload ke hosting — itu hanya untuk Apps Script) ke hosting gratis Anda, seperti biasa.

File yang **perlu** diupload ke hosting: semua file `.html`, `.css`, `.js`, dan gambar. **`Code.gs` dan `PANDUAN-ADMIN.md` tidak perlu diupload** — itu hanya referensi.

## Langkah 7 — Isi konten pertama kali

Karena ini instalasi baru, kolom konten di Google Sheets masih kosong. Website akan tetap menampilkan teks default yang sudah ada sekarang (aman, tidak blank). Untuk mulai mengelola dari dashboard:

1. Buka `namawebsite.com/admin-login.html`, login pakai password dari Langkah 3.
2. Buka tiap menu (Beranda, Profil, Potensi, Layanan, Kontak) — isi form sesuai konten yang ingin ditampilkan.
3. Klik **Simpan Perubahan**.
4. Refresh halaman publiknya — konten akan otomatis terganti dengan data dari Sheets.

Tab **Ulasan Pengunjung** menampilkan ulasan yang dikirim lewat form kontak, dan Anda bisa menghapus ulasan yang tidak pantas di sana.

---

## Catatan Keamanan

- Password admin disimpan dalam bentuk **hash** (terenkripsi satu arah) di Google, tidak pernah dikirim balik ke browser.
- Sesi login berlaku **4 jam**, setelah itu harus login ulang.
- Link menuju halaman admin ada di footer website (teks kecil "Admin"), dan halaman admin diberi tag `noindex` supaya tidak muncul di Google Search.
- Karena ini website statis + Apps Script gratis, sistem ini cukup untuk website desa skala kecil, tapi **bukan tingkat keamanan bank**. Jangan gunakan password yang sama dengan akun penting lain.
- Jika lupa password, ulangi Langkah 3 dengan password baru.
