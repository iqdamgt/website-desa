// =========================================================
// ADMIN.JS — dashboard admin Desa Semparuk
// =========================================================

// ---------- CEK LOGIN ----------
const adminToken = sessionStorage.getItem('adminToken');
if (!adminToken) {
  window.location.href = 'admin-login.html';
}

// ---------- SKEMA FORM PER HALAMAN ----------
const SCHEMAS = {
  beranda: {
    label: 'Beranda',
    fields: [
      { key: 'heroTitle', label: 'Judul Hero', type: 'text' },
      { key: 'heroSubtitle', label: 'Subjudul Hero', type: 'text' },
      { key: 'introTitle', label: 'Judul Bagian "Sekilas Tentang"', type: 'text' },
      { key: 'introText', label: 'Isi Teks "Sekilas Tentang"', type: 'textarea' },
      { key: 'stats', label: 'Kartu Statistik di Beranda', type: 'repeater', itemLabel: 'Statistik', fields: [
        { key: 'value', label: 'Nilai (contoh: 13,00 km²)', type: 'text' },
        { key: 'label', label: 'Label (contoh: Luas Wilayah)', type: 'text' }
      ]}
    ]
  },
  profil: {
    label: 'Profil Desa',
    fields: [
      { key: 'sejarah', label: 'Sejarah Desa', type: 'textarea' },
      { key: 'visiMisi', label: 'Visi & Misi', type: 'group', fields: [
        { key: 'visi', label: 'Visi', type: 'text' },
        { key: 'misi', label: 'Misi (satu baris = satu poin)', type: 'list' }
      ]},
      { key: 'geografis', label: 'Data Geografis', type: 'repeater', itemLabel: 'Baris Data', fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'value', label: 'Nilai (boleh pakai <br/> untuk baris baru)', type: 'textarea' }
      ]},
      { key: 'pemerintahan', label: 'Struktur Pemerintahan', type: 'repeater', itemLabel: 'Jabatan', fields: [
        { key: 'jabatan', label: 'Jabatan', type: 'text' },
        { key: 'nama', label: 'Nama Pejabat', type: 'text' }
      ]},
      { key: 'dusun', label: 'Wilayah Administratif (Dusun)', type: 'repeater', itemLabel: 'Dusun', fields: [
        { key: 'nama', label: 'Nama Dusun', type: 'text' },
        { key: 'kadus', label: 'Kepala Dusun', type: 'text' },
        { key: 'rt', label: 'Jumlah RT', type: 'text' }
      ]},
      { key: 'totalRT', label: 'Catatan Total RT (di bawah tabel dusun)', type: 'text' },
      { key: 'demografis', label: 'Data Demografis', type: 'group', fields: [
        { key: 'jumlahPenduduk', label: 'Jumlah Penduduk', type: 'text' },
        { key: 'kepadatan', label: 'Kepadatan', type: 'text' },
        { key: 'agama', label: 'Persentase Agama', type: 'repeater', itemLabel: 'Agama', fields: [
          { key: 'nama', label: 'Nama Agama', type: 'text' },
          { key: 'persen', label: 'Persentase', type: 'text' }
        ]},
        { key: 'etnis', label: 'Persentase Etnis', type: 'repeater', itemLabel: 'Etnis', fields: [
          { key: 'nama', label: 'Nama Etnis', type: 'text' },
          { key: 'persen', label: 'Persentase', type: 'text' }
        ]}
      ]},
      { key: 'mataPencaharian', label: 'Mata Pencaharian', type: 'repeater', itemLabel: 'Pekerjaan', fields: [
        { key: 'icon', label: 'Emoji/Ikon', type: 'text' },
        { key: 'judul', label: 'Judul', type: 'text' },
        { key: 'persen', label: 'Persentase', type: 'text' },
        { key: 'deskripsi', label: 'Deskripsi singkat', type: 'text' }
      ]},
      { key: 'fasilitas', label: 'Fasilitas Desa', type: 'repeater', itemLabel: 'Kategori Fasilitas', fields: [
        { key: 'icon', label: 'Emoji/Ikon', type: 'text' },
        { key: 'kategori', label: 'Nama Kategori', type: 'text' },
        { key: 'items', label: 'Daftar Fasilitas (satu baris = satu item)', type: 'list' }
      ]},
      { key: 'komoditas', label: 'Komoditas Unggulan', type: 'repeater', itemLabel: 'Komoditas', fields: [
        { key: 'icon', label: 'Emoji/Ikon', type: 'text' },
        { key: 'judul', label: 'Judul', type: 'text' },
        { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' }
      ]}
    ]
  },
  potensi: {
    label: 'Potensi Desa',
    fields: [
      { key: 'items', label: 'Daftar Potensi', type: 'repeater', itemLabel: 'Potensi', fields: [
        { key: 'judul', label: 'Judul', type: 'text' },
        { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
        { key: 'items', label: 'Daftar Poin (satu baris = satu poin)', type: 'list' }
      ]}
    ]
  },
  layanan: {
    label: 'Layanan Publik',
    fields: [
      { key: 'kategori', label: 'Kategori Layanan', type: 'repeater', itemLabel: 'Kategori', fields: [
        { key: 'icon', label: 'Emoji/Ikon', type: 'text' },
        { key: 'judul', label: 'Judul Kategori', type: 'text' },
        { key: 'items', label: 'Daftar Layanan (satu baris = satu item)', type: 'list' }
      ]},
      { key: 'jamPelayanan', label: 'Jam Pelayanan Kantor', type: 'repeater', itemLabel: 'Jadwal', fields: [
        { key: 'hari', label: 'Hari', type: 'text' },
        { key: 'jam', label: 'Jam', type: 'text' }
      ]}
    ]
  },
  kontak: {
    label: 'Kontak',
    fields: [
      { key: 'alamat', label: 'Alamat (boleh pakai <br/> untuk baris baru)', type: 'textarea' },
      { key: 'telepon', label: 'Telepon', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'jamOperasional', label: 'Jam Operasional', type: 'repeater', itemLabel: 'Jadwal', fields: [
        { key: 'hari', label: 'Hari', type: 'text' },
        { key: 'jam', label: 'Jam', type: 'text' }
      ]}
    ]
  }
};

const sectionDataStore = {};
const sectionLoaded = {};
let activeSection = 'beranda';

// ---------- HELPERS API ----------

function adminJsonp(url, onData) {
  const cbName = 'admin_cb_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  const script = document.createElement('script');
  window[cbName] = function (data) {
    delete window[cbName];
    script.remove();
    onData(data);
  };
  script.onerror = function () {
    delete window[cbName];
    script.remove();
    onData(null);
  };
  script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + cbName;
  document.body.appendChild(script);
}

async function apiPost(payload) {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ token: adminToken }, payload))
  });
  return res.json();
}

function logout() {
  sessionStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
}

// ---------- CEK SESI MASIH VALID ----------
apiPost({ action: 'checkToken' }).then(r => {
  if (!r.success) logout();
}).catch(() => {});

// ---------- FORM BUILDER GENERIK ----------

function buildField(container, fieldDef, dataObj) {
  const key = fieldDef.key;
  const isBig = fieldDef.type === 'repeater' || fieldDef.type === 'group';
  const wrap = document.createElement('div');
  wrap.className = isBig ? 'field-group' : 'sub-field';

  const label = document.createElement('label');
  label.textContent = fieldDef.label;
  if (!isBig) label.className = '';
  wrap.appendChild(label);

  if (fieldDef.type === 'text') {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = dataObj[key] || '';
    input.addEventListener('input', () => { dataObj[key] = input.value; });
    wrap.appendChild(input);

  } else if (fieldDef.type === 'textarea') {
    const ta = document.createElement('textarea');
    ta.value = dataObj[key] || '';
    ta.addEventListener('input', () => { dataObj[key] = ta.value; });
    wrap.appendChild(ta);

  } else if (fieldDef.type === 'list') {
    const ta = document.createElement('textarea');
    ta.value = (dataObj[key] || []).join('\n');
    ta.placeholder = 'Satu baris = satu item';
    ta.addEventListener('input', () => {
      dataObj[key] = ta.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    });
    wrap.appendChild(ta);

  } else if (fieldDef.type === 'group') {
    if (!dataObj[key] || typeof dataObj[key] !== 'object' || Array.isArray(dataObj[key])) dataObj[key] = {};
    fieldDef.fields.forEach(sub => buildField(wrap, sub, dataObj[key]));

  } else if (fieldDef.type === 'repeater') {
    if (!Array.isArray(dataObj[key])) dataObj[key] = [];
    const arr = dataObj[key];

    arr.forEach((item, idx) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'repeater-item';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-remove';
      removeBtn.textContent = '✕';
      removeBtn.title = 'Hapus';
      removeBtn.addEventListener('click', () => {
        arr.splice(idx, 1);
        renderCurrentPanel();
      });
      itemDiv.appendChild(removeBtn);

      fieldDef.fields.forEach(sub => buildField(itemDiv, sub, item));
      wrap.appendChild(itemDiv);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn-add';
    addBtn.textContent = '+ Tambah ' + (fieldDef.itemLabel || 'Item');
    addBtn.addEventListener('click', () => {
      arr.push({});
      renderCurrentPanel();
    });
    wrap.appendChild(addBtn);
  }

  container.appendChild(wrap);
}

function renderCurrentPanel() {
  const schema = SCHEMAS[activeSection];
  if (!schema) return;
  const formEl = document.getElementById('form-' + activeSection);
  if (!formEl) return;
  formEl.innerHTML = '';
  if (!sectionDataStore[activeSection]) sectionDataStore[activeSection] = {};
  schema.fields.forEach(f => buildField(formEl, f, sectionDataStore[activeSection]));
}

function loadSectionIfNeeded(section) {
  if (sectionLoaded[section]) return;
  sectionLoaded[section] = true;
  const formEl = document.getElementById('form-' + section);
  if (formEl) formEl.innerHTML = '<p style="color:#888;">Memuat data...</p>';

  adminJsonp(GOOGLE_SCRIPT_URL + '?action=getContent&section=' + encodeURIComponent(section), (data) => {
    sectionDataStore[section] = data || {};
    if (activeSection === section) renderCurrentPanel();
  });
}

async function saveSection(section) {
  const statusEl = document.getElementById('status-' + section);
  const btn = document.getElementById('save-' + section);
  btn.disabled = true;
  btn.textContent = 'Menyimpan...';
  statusEl.textContent = '';
  statusEl.className = 'save-status';

  try {
    const res = await apiPost({ action: 'updateContent', section: section, data: sectionDataStore[section] });
    if (res.success) {
      statusEl.textContent = 'Tersimpan ✓';
    } else {
      statusEl.textContent = res.error || 'Gagal menyimpan.';
      statusEl.className = 'save-status error';
      if (res.error && res.error.indexOf('Sesi') > -1) setTimeout(logout, 1500);
    }
  } catch (err) {
    statusEl.textContent = 'Gagal terhubung ke server.';
    statusEl.className = 'save-status error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Simpan Perubahan';
    setTimeout(() => { statusEl.textContent = ''; }, 4000);
  }
}

// ---------- NAVIGASI PANEL ----------

function switchPanel(section) {
  activeSection = section;
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-sidebar nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('panel-' + section).classList.add('active');
  document.getElementById('nav-' + section).classList.add('active');

  if (SCHEMAS[section]) {
    loadSectionIfNeeded(section);
    if (sectionLoaded[section] && sectionDataStore[section]) renderCurrentPanel();
  } else if (section === 'ulasan') {
    loadReviewsPanel();
  }
}

// ---------- MODERASI ULASAN ----------

let reviewsLoaded = false;

function loadReviewsPanel() {
  const list = document.getElementById('reviewsList');
  if (reviewsLoaded) return;
  reviewsLoaded = true;
  list.innerHTML = '<p style="color:#888;">Memuat ulasan...</p>';

  adminJsonp(GOOGLE_SCRIPT_URL + '?action=getReviews', (reviews) => {
    if (!reviews || reviews.length === 0) {
      list.innerHTML = '<p style="color:#888;">Belum ada ulasan.</p>';
      return;
    }
    list.innerHTML = '';
    reviews.forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card';
      const waktu = r.waktu ? new Date(r.waktu).toLocaleString('id-ID') : '';
      card.innerHTML = `
        <div class="review-top">
          <strong>${escapeHtml(r.nama)}</strong>
          <button class="btn-delete-review">Hapus</button>
        </div>
        <div>${'⭐'.repeat(Number(r.rating) || 0)} &nbsp; <span style="color:#888;font-size:0.85rem;">${waktu}</span></div>
        <div style="font-weight:600;margin-top:0.3rem;">${escapeHtml(r.subjek)}</div>
        <p>${escapeHtml(r.pesan)}</p>
      `;
      card.querySelector('.btn-delete-review').addEventListener('click', async () => {
        if (!confirm('Hapus ulasan dari ' + r.nama + '?')) return;
        const res = await apiPost({ action: 'deleteReview', idx: r.__idx });
        if (res.success) {
          card.remove();
        } else {
          alert(res.error || 'Gagal menghapus ulasan.');
        }
      });
      list.appendChild(card);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

// ---------- GANTI PASSWORD ----------

async function changePassword() {
  const oldP = document.getElementById('oldPassword').value;
  const newP = document.getElementById('newPassword').value;
  const statusEl = document.getElementById('passwordStatus');
  statusEl.textContent = '';
  statusEl.className = 'save-status';

  if (!oldP || !newP) {
    statusEl.textContent = 'Isi password lama dan baru.';
    statusEl.className = 'save-status error';
    return;
  }

  const res = await apiPost({ action: 'changePassword', oldPassword: oldP, newPassword: newP });
  if (res.success) {
    statusEl.textContent = 'Password berhasil diganti.';
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
  } else {
    statusEl.textContent = res.error || 'Gagal mengganti password.';
    statusEl.className = 'save-status error';
  }
}

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.admin-sidebar nav a[data-section]').forEach(a => {
    a.addEventListener('click', () => switchPanel(a.dataset.section));
  });
  document.querySelectorAll('.btn-save[data-section]').forEach(btn => {
    btn.addEventListener('click', () => saveSection(btn.dataset.section));
  });
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('changePasswordBtn').addEventListener('click', changePassword);

  switchPanel('beranda');
});
