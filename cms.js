// =========================================================
// CMS.JS — memuat konten dari Google Sheets (via Apps Script)
// dan menggantikan konten statis di halaman jika data tersedia.
// Jika data belum diisi dari dashboard admin, konten statis
// bawaan di HTML tetap tampil apa adanya (aman, tidak blank).
// =========================================================

function cmsEsc(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function cmsJsonp(url, onData) {
  if (typeof GOOGLE_SCRIPT_URL === 'undefined') return;
  const cbName = 'cms_cb_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  const script = document.createElement('script');

  window[cbName] = function (data) {
    delete window[cbName];
    script.remove();
    onData(data);
  };
  script.onerror = function () {
    delete window[cbName];
    script.remove();
  };
  script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + cbName;
  document.body.appendChild(script);
}

function cmsLoadSection(section, onData) {
  cmsJsonp(
    GOOGLE_SCRIPT_URL + '?action=getContent&section=' + encodeURIComponent(section),
    function (data) {
      if (data) onData(data);
    }
  );
}

function cmsSetText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
}

// ================= BERANDA (index.html) =================
function cmsRenderBeranda(data) {
  if (data.heroTitle) cmsSetText('cms-hero-title', data.heroTitle);
  if (data.heroSubtitle) cmsSetText('cms-hero-subtitle', data.heroSubtitle);
  if (data.introTitle) cmsSetText('cms-intro-title', data.introTitle);
  if (data.introText) cmsSetText('cms-intro-text', data.introText);

  const stats = document.getElementById('cms-stats');
  if (stats && Array.isArray(data.stats) && data.stats.length) {
    stats.innerHTML = data.stats.map(s => `
      <div class="stat-card">
        <h3>${cmsEsc(s.value)}</h3>
        <p>${cmsEsc(s.label)}</p>
      </div>
    `).join('');
  }
}

// ================= PROFIL (profil.html) =================
function cmsRenderProfil(data) {
  if (data.sejarah) cmsSetText('cms-sejarah-text', data.sejarah);

  if (data.visiMisi) {
    if (data.visiMisi.visi) cmsSetText('cms-visi-text', data.visiMisi.visi);
    const misiList = document.getElementById('cms-misi-list');
    if (misiList && Array.isArray(data.visiMisi.misi)) {
      misiList.innerHTML = data.visiMisi.misi.map(m => `<li>${cmsEsc(m)}</li>`).join('');
    }
  }

  const geo = document.getElementById('cms-geografis-body');
  if (geo && Array.isArray(data.geografis)) {
    geo.innerHTML = data.geografis.map(g => `
      <tr><td><strong>${cmsEsc(g.label)}</strong></td><td>${g.value}</td></tr>
    `).join('');
  }

  const pem = document.getElementById('cms-pemerintahan');
  if (pem && Array.isArray(data.pemerintahan)) {
    pem.innerHTML = data.pemerintahan.map(p => `
      <div class="position"><h3>${cmsEsc(p.jabatan)}</h3><p>${cmsEsc(p.nama)}</p></div>
    `).join('');
  }

  const dusunBody = document.getElementById('cms-dusun-body');
  if (dusunBody && Array.isArray(data.dusun)) {
    dusunBody.innerHTML = data.dusun.map(d => `
      <tr><td><strong>${cmsEsc(d.nama)}</strong></td><td>Kepala Dusun: ${cmsEsc(d.kadus)}</td><td>Jumlah RT: ${cmsEsc(d.rt)}</td></tr>
    `).join('');
    if (data.totalRT) cmsSetText('cms-dusun-total', '*Total: ' + data.totalRT + ' RT di Desa Semparuk');
  }

  if (data.demografis) {
    const dem = data.demografis;
    if (dem.jumlahPenduduk) cmsSetText('cms-jumlah-penduduk', dem.jumlahPenduduk);
    if (dem.kepadatan) cmsSetText('cms-kepadatan', dem.kepadatan);
    const agamaEl = document.getElementById('cms-agama');
    if (agamaEl && Array.isArray(dem.agama)) {
      agamaEl.innerHTML = dem.agama.map(a => `${cmsEsc(a.nama)}: ${cmsEsc(a.persen)}`).join('<br/>');
    }
    const etnisEl = document.getElementById('cms-etnis');
    if (etnisEl && Array.isArray(dem.etnis)) {
      etnisEl.innerHTML = dem.etnis.map(a => `${cmsEsc(a.nama)}: ${cmsEsc(a.persen)}`).join('<br/>');
    }
  }

  const mp = document.getElementById('cms-mata-pencaharian');
  if (mp && Array.isArray(data.mataPencaharian)) {
    mp.innerHTML = data.mataPencaharian.map(m => `
      <div class="mata-pencaharian-card">
        <h3>${cmsEsc(m.icon)} ${cmsEsc(m.judul)}</h3>
        <p>${cmsEsc(m.persen)} - ${cmsEsc(m.deskripsi)}</p>
      </div>
    `).join('');
  }

  const fas = document.getElementById('cms-fasilitas');
  if (fas && Array.isArray(data.fasilitas)) {
    fas.innerHTML = data.fasilitas.map(f => `
      <div class="fasilitas-card">
        <h3>${cmsEsc(f.icon)} ${cmsEsc(f.kategori)}</h3>
        <ul>${(f.items || []).map(i => `<li>${cmsEsc(i)}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  const kom = document.getElementById('cms-komoditas');
  if (kom && Array.isArray(data.komoditas)) {
    kom.innerHTML = data.komoditas.map(k => `
      <div class="komoditas-card">
        <h3>${cmsEsc(k.icon)} ${cmsEsc(k.judul)}</h3>
        <p>${cmsEsc(k.deskripsi)}</p>
      </div>
    `).join('');
  }
}

// ================= POTENSI (potensi.html) =================
function cmsRenderPotensi(data) {
  const grid = document.getElementById('cms-potensi-grid');
  if (grid && Array.isArray(data.items)) {
    grid.innerHTML = data.items.map(p => `
      <div class="potensi-card">
        <h3>${cmsEsc(p.judul)}</h3>
        <p>${cmsEsc(p.deskripsi)}</p>
        <ul>${(p.items || []).map(i => `<li>${cmsEsc(i)}</li>`).join('')}</ul>
      </div>
    `).join('');
  }
}

// ================= LAYANAN (layanan.html) =================
function cmsRenderLayanan(data) {
  const grid = document.getElementById('cms-layanan-grid');
  if (grid && Array.isArray(data.kategori)) {
    grid.innerHTML = data.kategori.map(k => `
      <div class="layanan-card">
        <h3>${cmsEsc(k.icon)} ${cmsEsc(k.judul)}</h3>
        <ul>${(k.items || []).map(i => `<li>${cmsEsc(i)}</li>`).join('')}</ul>
      </div>
    `).join('');
  }
  const jam = document.getElementById('cms-jam-layanan-body');
  if (jam && Array.isArray(data.jamPelayanan)) {
    jam.innerHTML = data.jamPelayanan.map(j => `<tr><td>${cmsEsc(j.hari)}</td><td>${cmsEsc(j.jam)}</td></tr>`).join('');
  }
}

// ================= KONTAK (kontak.html) =================
function cmsRenderKontak(data) {
  if (data.alamat) cmsSetText('cms-alamat', data.alamat);
  if (data.telepon) cmsSetText('cms-telepon', data.telepon);
  if (data.email) cmsSetText('cms-email', data.email);
  const jam = document.getElementById('cms-jam-operasional');
  if (jam && Array.isArray(data.jamOperasional)) {
    jam.innerHTML = data.jamOperasional.map(j => `${cmsEsc(j.hari)}: ${cmsEsc(j.jam)}`).join('<br/>');
  }
}

// ================= INISIALISASI PER HALAMAN =================
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    cmsLoadSection('beranda', cmsRenderBeranda);
  } else if (page === 'profil.html') {
    cmsLoadSection('profil', cmsRenderProfil);
  } else if (page === 'potensi.html') {
    cmsLoadSection('potensi', cmsRenderPotensi);
  } else if (page === 'layanan.html') {
    cmsLoadSection('layanan', cmsRenderLayanan);
  } else if (page === 'kontak.html') {
    cmsLoadSection('kontak', cmsRenderKontak);
  }
});
