<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <!-- Logo dan Brand -->
        <a class="navbar-brand" href="#">Classroom</a>

        <!-- Tombol Burger (untuk mobile) -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menu Navigasi -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#">Beranda</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Tugas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Kelas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="account.html">Akun</a>
            </li>
            <li class="nav-item">
              <!-- Ikon Profil -->
              <a class="nav-link" href="#">
                <img src="https://via.placeholder.com/32" class="profile-icon" alt="Profil">
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container my-5">
      <h1 class="text-center mb-4">Buat Kelas Baru</h1>
      <div class="card mx-auto" style="max-width: 600px;">
        <div class="card-body">
          <form @submit.prevent="handleCreateClass">
            <div class="mb-3">
              <label>Nama Kelas</label>
              <input v-model="className" type="text" class="form-control" placeholder="Masukkan nama kelas" required>
            </div>
            <div class="mb-3">
              <label>Mata Pelajaran</label>
              <input v-model="sbuject" type="text" class="form-control" placeholder="Masukkan Mata Pelajaran" required>
            </div>
            <div class="mb-3">
              <label>Deskripsi Kelas</label>
              <input v-model="description" type="text" class="form-control" placeholder="Masukkan Deskripsi Kelas (Opsional)">
            </div>

            <div class="d-flex justify-content-center gap-3 mt-3">
              <button class="butt align-items-center d-flex">
                <span class="links text-center">Buat Kelas</span>
                <div class="arrow-wrapper">
                  <div class="arrow"></div>
                </div>
              </button>
              <button class="butto align-items-center d-flex">
                <a href="#" class="links">Batal</a>
                <div class="arrow-wrapper">
                  <div class="arrow"></div>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; // Pastikan SweetAlert2 diimport

export default {
  name: "MakeClass",
  data() {
    return {
      className: "",
      subject: "",
      description: ""
    };
  },
  methods: {
    async handleCreateClass() {
  // Ambil token dari localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    // Mengganti alert biasa dengan SweetAlert
    Swal.fire({
      icon: 'error',
      title: 'Token tidak ditemukan',
      text: 'Harap login terlebih dahulu.',
    });
    return;
  }

  // Data kelas yang akan dikirim
  const classData = {
    className: this.className,
    subject: this.subject,
    description: this.description
  };

  try {
    // Mengirim data menggunakan fetch API
    const response = await fetch(`http://localhost:4000/api/classroom/add/newClass?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(classData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("status data", data.status)
      if (data.status === "invalid") {
        // Menggunakan SweetAlert untuk konfirmasi
        const isConfirmed = await Swal.fire({
          title: data.message,
          text: 'Apakah Anda yakin ingin melanjutkan?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, lanjutkan',
          cancelButtonText: 'Batal'
        });

        if (isConfirmed.isConfirmed) {
          // Jika konfirmasi berhasil, kirim data tambahan
          const additionalData = {
            className: this.className,
            subject: this.subject,
            description: this.description,
            confirm: true
          };

          // Kirim data tambahan ke server
          const additionalResponse = await fetch(`http://localhost:4000/api/classroom/add/newClass?token=${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(additionalData)
          });

          const additionalDataResponse = await additionalResponse.json();
          if (additionalResponse.ok) {
            Swal.fire({
              icon: 'success',
              title: `sukses membuat kelas ${this.className }`,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Terjadi kesalahan',
              text: additionalDataResponse.message,
            });
          }
        }
      } else {
        // Jika status bukan "invalid", tampilkan SweetAlert sukses
        Swal.fire({
          icon: 'success',
          title: 'Kelas berhasil dibuat',
          text: 'Kelas baru telah berhasil dibuat!',
        });
      }

      // Reset form setelah berhasil
      this.className = "";
      this.subject = "";
      this.description = "";

    } else {
      // Jika response tidak OK
      Swal.fire({
        icon: 'error',
        title: 'Gagal membuat kelas',
        text: data.message,
      });
    }
  } catch (error) {
    // Menampilkan error jika gagal menghubungi server
    Swal.fire({
      icon: 'error',
      title: 'Terjadi kesalahan',
      text: 'Saat menghubungi server.',
    });
  }
}

  },
  mounted() {
    if (typeof window !== "undefined") {
      const scriptPopper = document.createElement("script");
      scriptPopper.src = "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js";
      document.head.appendChild(scriptPopper);

      const scriptBootstrap = document.createElement("script");
      scriptBootstrap.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js";
      document.head.appendChild(scriptBootstrap);
    }
  }
};
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css');

.butt {
    --primary-color: #4285F4;
    --secondary-color: #fff;
    --hover-color: #111;
    --arrow-width: 10px;
    --arrow-stroke: 2px;
    box-sizing: border-box;
    border: 0;
    border-radius: 7px;
    color: var(--secondary-color);
    padding: 0.5em 1.0em;
    background: var(--primary-color);
    display: flex;
    transition: 0.2s background;
    align-items: center;
    gap: 0.6em;
    font-weight: bold;
}

.butt .arrow-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.butt .arrow {
    margin-top: 1px;
    width: var(--arrow-width);
    background: var(--primary-color);
    height: var(--arrow-stroke);
    position: relative;
    transition: 0.2s;
}

.butt .arrow::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: solid var(--secondary-color);
    border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
    display: inline-block;
    top: -3px;
    right: 3px;
    transition: 0.2s;
    padding: 3px;
    transform: rotate(-45deg);
}

.butt:hover {
    background-color: var(--hover-color);
}

.butt:hover .arrow {
    background: var(--secondary-color);
}

.butt:hover .arrow:before {
    right: 0;
}

.links {
    text-decoration: none;
    color: white;
}

.butto {
    --primary-color: #7e0606;
    --secondary-color: #fff;
    --hover-color: #111;
    --arrow-width: 10px;
    --arrow-stroke: 2px;
    box-sizing: border-box;
    border: 0;
    border-radius: 7px;
    color: var(--secondary-color);
    padding: 0.5em 1.0em;
    background: var(--primary-color);
    display: flex;
    transition: 0.2s background;
    align-items: center;
    gap: 0.6em;
    font-weight: bold;
}

.butto .arrow-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.butto .arrow {
    margin-top: 1px;
    width: var(--arrow-width);
    background: var(--primary-color);
    height: var(--arrow-stroke);
    position: relative;
    transition: 0.2s;
}

.butto .arrow::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: solid var(--secondary-color);
    border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
    display: inline-block;
    top: -3px;
    right: 3px;
    transition: 0.2s;
    padding: 3px;
    transform: rotate(-45deg);
}

.butto:hover {
    background-color: var(--hover-color);
}

.butto:hover .arrow {
    background: var(--secondary-color);
}

.butto:hover .arrow:before {
    right: 0;
}

.profile-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}
</style>
