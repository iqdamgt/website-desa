/**
 * =========================================================
 *  BACKEND WEBSITE DESA SEMPARUK (Google Apps Script)
 * =========================================================
 *  Menangani:
 *  - Ulasan pengunjung (kontak.html) - sudah ada sebelumnya
 *  - Login admin
 *  - Simpan & ambil konten yang bisa diedit dari dashboard admin
 *
 *  CARA PAKAI:
 *  1. Ganti seluruh isi Code.gs project Apps Script Anda dengan kode ini.
 *  2. Jalankan fungsi setAdminPassword() SEKALI dari editor (lihat paling
 *     bawah file ini) untuk mengatur password admin.
 *  3. Deploy ulang sebagai Web App (Deploy > New deployment).
 *  4. Salin URL Web App ke file config.js di website.
 *  Panduan lengkap ada di PANDUAN-ADMIN.md
 * =========================================================
 */

// ================= KONFIGURASI =================
// Nama tab ulasan di spreadsheet INI (spreadsheet tempat script ini nempel)
const REVIEWS_SHEET_NAME = 'Pesan';

// ================= ROUTER =================

function doGet(e) {
  var action = e.parameter.action;

  if (action === 'getReviews') {
    return jsonpOrJson(getReviews(), e.parameter.callback);
  }
  if (action === 'getContent') {
    return jsonpOrJson(getContent(e.parameter.section), e.parameter.callback);
  }
  return jsonpOrJson({ error: 'Aksi tidak dikenali' }, e.parameter.callback);
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    body = {};
  }

  var action = body.action;

  if (action === 'login') {
    return json(handleLogin(body.password));
  }
  if (action === 'updateContent') {
    return json(handleUpdateContent(body.token, body.section, body.data));
  }
  if (action === 'changePassword') {
    return json(handleChangePassword(body.token, body.oldPassword, body.newPassword));
  }
  if (action === 'deleteReview') {
    return json(handleDeleteReview(body.token, body.idx));
  }
  if (action === 'checkToken') {
    return json({ success: verifyToken(body.token) });
  }

  // Kompatibel dengan form kontak lama (tidak mengirim field "action")
  if (body.nama && body.pesan) {
    return json(addReview(body));
  }

  return json({ success: false, error: 'Aksi tidak dikenali' });
}

// ================= HELPERS OUTPUT =================

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonpOrJson(data, callback) {
  var payload = JSON.stringify(data);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + payload + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

// ================= ULASAN (REVIEWS) — sheet "Pesan" di spreadsheet ini =================

function getReviewsSheet() {
  return getSheet(REVIEWS_SHEET_NAME);
}

function getReviews() {
  var sheet = getReviewsSheet();
  ensureHeaders(sheet, ['nama', 'email', 'subjek', 'pesan', 'rating', 'waktu']);
  var values = sheet.getDataRange().getValues();
  var result = [];
  // Kolom tetap: A=nama, B=email, C=subjek, D=pesan, E=rating, F=waktu
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[0]) continue; // lewati baris kosong
    result.push({
      nama: row[0],
      email: row[1],
      subjek: row[2],
      pesan: row[3],
      rating: row[4],
      waktu: row[5],
      __idx: i - 1 // dipakai untuk hapus ulasan dari dashboard
    });
  }
  return result.reverse(); // terbaru duluan
}

function addReview(data) {
  var sheet = getReviewsSheet();
  ensureHeaders(sheet, ['nama', 'email', 'subjek', 'pesan', 'rating', 'waktu']);
  sheet.appendRow([data.nama, data.email, data.subjek, data.pesan, data.rating, new Date().toISOString()]);
  return { success: true };
}

function handleDeleteReview(token, idx) {
  if (!verifyToken(token)) return { success: false, error: 'Sesi admin tidak valid, silakan login ulang.' };
  var sheet = getReviewsSheet();
  sheet.deleteRow(Number(idx) + 2); // +1 header, +1 karena 1-indexed
  return { success: true };
}

// ================= KONTEN (CMS) =================

function getContent(section) {
  var sheet = getSheet('Content');
  ensureHeaders(sheet, ['section', 'data', 'updatedAt']);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === section) {
      try {
        return JSON.parse(values[i][1]);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

function handleUpdateContent(token, section, data) {
  if (!verifyToken(token)) return { success: false, error: 'Sesi admin tidak valid, silakan login ulang.' };
  if (!section) return { success: false, error: 'Section wajib diisi' };

  var sheet = getSheet('Content');
  ensureHeaders(sheet, ['section', 'data', 'updatedAt']);
  var values = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === section) {
      rowIndex = i + 1; // nomor baris di sheet (1-indexed)
      break;
    }
  }

  var jsonData = JSON.stringify(data);
  var now = new Date().toISOString();

  if (rowIndex === -1) {
    sheet.appendRow([section, jsonData, now]);
  } else {
    sheet.getRange(rowIndex, 2).setValue(jsonData);
    sheet.getRange(rowIndex, 3).setValue(now);
  }
  return { success: true };
}

// ================= AUTH ADMIN =================

function handleLogin(password) {
  var hash = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD_HASH');
  if (!hash) {
    return { success: false, error: 'Password admin belum diatur. Jalankan fungsi setAdminPassword() di editor Apps Script terlebih dahulu.' };
  }
  if (sha256(password) !== hash) {
    return { success: false, error: 'Password salah.' };
  }
  var token = Utilities.getUuid();
  CacheService.getScriptCache().put('token_' + token, '1', 14400); // berlaku 4 jam
  return { success: true, token: token };
}

function verifyToken(token) {
  if (!token) return false;
  return CacheService.getScriptCache().get('token_' + token) === '1';
}

function handleChangePassword(token, oldPassword, newPassword) {
  if (!verifyToken(token)) return { success: false, error: 'Sesi admin tidak valid.' };
  var props = PropertiesService.getScriptProperties();
  var hash = props.getProperty('ADMIN_PASSWORD_HASH');
  if (sha256(oldPassword) !== hash) return { success: false, error: 'Password lama salah.' };
  if (!newPassword || newPassword.length < 6) return { success: false, error: 'Password baru minimal 6 karakter.' };
  props.setProperty('ADMIN_PASSWORD_HASH', sha256(newPassword));
  return { success: true };
}

function sha256(text) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text));
  return digest.map(function (b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

/**
 * =========================================================
 *  JALANKAN FUNGSI INI SATU KALI SAJA dari editor Apps Script
 *  untuk mengatur password admin pertama kali (atau menggantinya
 *  jika lupa password).
 *
 *  Caranya:
 *  1. Ganti 'GANTI_PASSWORD_INI' di bawah dengan password pilihan Anda.
 *  2. Pilih fungsi "setAdminPassword" di dropdown atas editor Apps Script.
 *  3. Klik tombol "Run" (▶).
 *  4. Setelah selesai jalan, kembalikan baris password ke placeholder
 *     lagi (opsional, demi keamanan) supaya tidak tersimpan di kode.
 * =========================================================
 */
function setAdminPassword() {
  var password = 'GANTI_PASSWORD_INI';
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD_HASH', sha256(password));
  Logger.log('Password admin berhasil diatur.');
}
