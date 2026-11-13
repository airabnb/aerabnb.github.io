# ALMAIRA AYU // Futuristic Cybernetic Digital Profile Website

Website profil dan portofolio interaktif dengan desain futuristik bertema **Digital Cyberpunk & Sci-Fi HUD**. Memadukan animasi visual berbasis canvas, efek decoding teks, kartu interaktif 3D, sintesis audio prosedural via Web Audio API, serta terminal interaktif hacker.

---

## 📁 Struktur Direktori Terorganisir

```
aira/
├── index.html                   # Halaman utama profil dengan struktur semantik modern
├── README.md                    # Dokumentasi lengkap & panduan kustomisasi
├── css/
│   ├── style.css                # Dasar layout, tipografi Orbitron & JetBrains Mono, HUD top bar, navigasi
│   ├── components.css           # Komponen UI: tombol chamfered, kartu tilt, terminal, form, modal
│   └── animations.css           # Keyframe animasi: glitch text, radar sweep, 3D cube, scanlines, pulsasi
├── js/
│   ├── audio.js                 # Generator efek suara futuristik sintetis (Web Audio API native)
│   ├── particles.js             # Konstelasi partikel digital interaktif pada HTML5 Canvas
│   ├── terminal.js              # Simulator terminal konsol hacker lengkap dengan perintah & history
│   └── main.js                  # Engine utama: kursor cyber, decoding teks, kartu 3D tilt, modal & form
└── assets/
    └── images/
        └── avatar-core.svg      # Vektor inti hologram & cyber badge avatar
```

---

## ⚡ Fitur Utama & Interaktivitas

1. **Digital Canvas Constellation (`js/particles.js`)**:
   - Jaringan partikel bercahaya neon (`#00f0ff`, `#7000ff`, `#00ff9d`) yang bereaksi secara fisik terhadap gerakan kursor mouse.
   - Efek garis koneksi dinamis dan scanlines retro-futuristik.

2. **Sintesis Audio Prosedural (`js/audio.js`)**:
   - Efek suara sci-fi saat hover, klik, eksekusi perintah, dan pengiriman form.
   - Dibuat secara prosedural menggunakan osilator bawaan browser (Web Audio API) tanpa memerlukan file MP3/WAV eksternal.
   - Tombol toggle audio di bilah HUD atas (`AUDIO: ON / MUTED`) dengan persistensi status di `localStorage`.

3. **Text Scramble / Hacker Decoder Animation (`js/main.js`)**:
   - Teks berganti secara dinamis dengan efek dekripsi karakter acak (Matrix cipher decode).

4. **3D Specular Tilt Cards**:
   - Efek kemiringan 3D interaktif pada kartu identitas, keahlian, dan proyek berdasarkan posisi kursor.

5. **Terminal Interaktif Hacker (`js/terminal.js`)**:
   - Konsol mirip shell terminal bash Linux yang berfungsi penuh.
   - Mendukung riwayat perintah (tombol panah Atas/Bawah), tombol pintasan (*pill buttons*), dan efek **Matrix rain flood** (`matrix`).
   - Perintah yang didukung: `help`, `about`, `skills`, `projects`, `contact`, `matrix`, `ping`, `date`, `whoami`, `clear`.

6. **Filter Keahlian Dinamis**:
   - Filter modul keahlian (Semua, Frontend & UI, Backend & API, Tools & DevOps) dengan transisi mulus dan indikator level mastery.

7. **Modal Inspeksi Proyek**:
   - Tinjauan detail arsitektur sistem, stack teknologi, dan highlight proyek.

8. **Form Transmisi Pesan dengan Simulasi Enkripsi**:
   - Validasi formulir dengan feedback status enkripsi paket SHA-256 dan progress bar pengiriman data.

---

## 🚀 Cara Menjalankan

Website ini dibangun murni menggunakan **HTML5, CSS3, dan Vanilla JavaScript (ESNext)** tanpa ketergantungan library eksternal yang rumit.

1. Buka folder `c:\Users\LENOVO\Documents\project\aira`.
2. Klik ganda file `index.html` untuk langsung membukanya di browser apa pun (Google Chrome, Microsoft Edge, Mozilla Firefox, dll.).
3. Anda juga dapat menggunakan ekstensi seperti **Live Server** di VS Code untuk preview langsung saat mengedit kode.

---

## 🛠️ Panduan Kustomisasi

- **Mengubah Nama & Bio**:
  Buka `index.html` dan cari tag `ALMAIRA AYU` pada bagian `<h1 class="hero-title">` dan teks pengantar di bawahnya.
- **Mengubah Warna Neon**:
  Buka `css/style.css` pada bagian `:root` untuk mengganti `--neon-cyan`, `--neon-purple`, atau `--neon-green`.
- **Menambah Proyek**:
  Edit bagian `<section id="projects">` di `index.html` dan array `projectData` di `js/main.js`.
- **Mengubah Kontak**:
  Sesuaikan link email, GitHub, dan LinkedIn di bagian `<section id="contact">`.
