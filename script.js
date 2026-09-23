// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
  });

  // Tutup menu saat klik link navigasi
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.textContent = '☰';
    });
  });
}

// ===== ACTIVE NAV LINK (highlight halaman aktif) =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  }
});

// ===== SMOOTH SCROLL (untuk link internal) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===== ANIMATION ON SCROLL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Terapkan animasi pada elemen tertentu
document.querySelectorAll('.stat-card, .potensi-card, .berita-card, .fasilitas-card, .mata-pencaharian-card, .komoditas-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== CONTACT FORM + GOOGLE SHEETS =====
// GOOGLE_SCRIPT_URL sekarang didefinisikan di config.js (dimuat sebelum file ini)

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Validasi
    if (
      !data.nama ||
      !data.email ||
      !data.subjek ||
      !data.pesan ||
      !data.rating
    ) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          nama: data.nama,
          email: data.email,
          subjek: data.subjek,
          pesan: data.pesan,
          rating: data.rating
        })
      });

      alert('Terima kasih! Pesan dan rating berhasil dikirim.');
      contactForm.reset();

      // Perbarui daftar ulasan
      loadReviews();

    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengirim pesan.');
    }
  });
}


// ===== MENAMPILKAN ULASAN =====

function loadReviews() {
  const container = document.getElementById('daftarUlasan');
  const loading = document.getElementById('loadingUlasan');

  // Hanya berjalan di kontak.html
  if (!container) return;

  const callbackName = 'reviewsCallback_' + Date.now();

  window[callbackName] = function(reviews) {

    delete window[callbackName];
    script.remove();

    if (loading) {
      loading.style.display = 'none';
    }

    if (!reviews || reviews.length === 0) {
      container.innerHTML = `
        <p class="ulasan-kosong">
          Belum ada ulasan yang ditampilkan.
        </p>
      `;
      return;
    }

    container.innerHTML = reviews.map(review => {

      const tanggal = new Date(review.waktu);

      const waktu = tanggal.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const rating = '⭐'.repeat(Number(review.rating));

      return `
        <div class="ulasan-card">

          <div class="ulasan-header">
            <strong>${escapeHTML(review.nama)}</strong>

            <span>${waktu}</span>
          </div>

          <div class="ulasan-rating">
            ${rating}
          </div>

          <h3>${escapeHTML(review.subjek)}</h3>

          <p>
            ${escapeHTML(review.pesan)}
          </p>

        </div>
      `;

    }).join('');
  };

  const script = document.createElement('script');

  script.src =
    GOOGLE_SCRIPT_URL +
    '?action=getReviews&callback=' +
    callbackName;

  script.onerror = function() {

    delete window[callbackName];
    script.remove();

    if (loading) {
      loading.textContent = 'Ulasan gagal dimuat.';
    }
  };

  document.body.appendChild(script);
}


// ===== KEAMANAN TEKS ULASAN =====

function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}


// ===== LOAD ULASAN SAAT HALAMAN DIBUKA =====

document.addEventListener('DOMContentLoaded', () => {
  loadReviews();
});

function loadReviews() {
  const container = document.getElementById("daftarUlasan");
  const loading = document.getElementById("loadingUlasan");

  if (!container) return;

  const callbackName = "reviewsCallback_" + Date.now();

  window[callbackName] = function (reviews) {
    delete window[callbackName];
    script.remove();

    if (loading) {
      loading.style.display = "none";
    }

    if (!reviews || reviews.length === 0) {
      container.innerHTML = `
        <p class="ulasan-kosong">
          Belum ada ulasan yang ditampilkan.
        </p>
      `;
      return;
    }

    container.innerHTML = reviews.map(review => {
      const tanggal = new Date(review.waktu);

      const waktu = tanggal.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const rating = "⭐".repeat(Number(review.rating));

      return `
        <div class="ulasan-card">
          <div class="ulasan-header">
            <strong>${escapeHTML(review.nama)}</strong>
            <span>${waktu}</span>
          </div>

          <div class="ulasan-rating">
            ${rating}
          </div>

          <h3>${escapeHTML(review.subjek)}</h3>

          <p>
            ${escapeHTML(review.pesan)}
          </p>
        </div>
      `;
    }).join("");
  };

  const script = document.createElement("script");

  script.src =
    GOOGLE_SCRIPT_URL +
    "?action=getReviews&callback=" +
    callbackName;

  script.onerror = function () {
    delete window[callbackName];
    script.remove();

    if (loading) {
      loading.textContent = "Ulasan gagal dimuat.";
    }
  };

  document.body.appendChild(script);
}


function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}


document.addEventListener("DOMContentLoaded", () => {
  loadReviews();
});

console.log('Website Desa Semparuk loaded successfully! 🌿');