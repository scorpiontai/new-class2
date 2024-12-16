<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <!-- Logo dan Brand -->
        <a class="navbar-brand" href="#">Classroom</a>

        <!-- Tombol Burger (untuk mobile) -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
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
         
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Profile Section -->
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <!-- Foto Profil -->
          <img
            :src="profileImageUrl"
            class="rounded-circle mb-4"
            alt="Foto Profil" width="150px" height="150px"
          />
          <!-- Nama -->
          <h2 class="fw-bold">{{ username }}</h2>
          <!-- Deskripsi Singkat -->
          <p class="text-muted">
            Deskripsi singkat tentang Anda. Misalnya, profesi, hobi, atau motto hidup.
          </p>
          <!-- Status Online -->
          <div class="d-flex justify-content-center align-items-center mb-3">
            <div :class="statusClass" style="width: 15px; height: 15px; margin-right: 10px;"></div>
            <span>{{ onlineStatus }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Radio Buttons -->
    <div class="radio-container">
      <input id="radio-free" name="radio" type="radio" checked />
      <label for="radio-free">Ganti Akun</label>
      <input id="radio-basic" name="radio" type="radio" />
      <label for="radio-basic">Setelan Akun</label>

      <div class="glider-container">
        <div class="glider"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AccountPage",
  data() {
    return {
      username: "", // Akan diisi dengan hasil fetching API
      onlineStatus: "", // Menyimpan status koneksi
    };
  },
  computed: {
    profileImageUrl() {
      return this.username
        ? `http://localhost:4000/api/dashboard/profile/${this.username}`
        : null
    },
    statusClass() {
      return this.onlineStatus === "online" ? "bg-success" : "bg-danger"; // Menentukan kelas berdasarkan status koneksi
    }
  },
  methods: {
    async updateStatus(status) {
      this.onlineStatus = status; // Mengupdate status koneksi
      console.log(`Status koneksi: ${status}`);
    },
    statusLog() {
      window.addEventListener("load", async () => {
        const status = navigator.onLine ? "online" : "offline";
        await this.updateStatus(status);
      });

      window.addEventListener("beforeunload", async () => {
        const status = "offline";
        await this.updateStatus(status);
      });

      window.addEventListener("online", async () => {
        await this.updateStatus("online");
      });

      window.addEventListener("offline", async () => {
        await this.updateStatus("offline");
      });
    }
  },
  mounted() {
    // Tambahkan Bootstrap & PopperJS jika tidak tersedia
    if (typeof window !== "undefined") {
      const scriptPopper = document.createElement("script");
      scriptPopper.src =
        "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js";
      document.head.appendChild(scriptPopper);

      const scriptBootstrap = document.createElement("script");
      scriptBootstrap.src =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js";
      document.head.appendChild(scriptBootstrap);
    }

    // Fetch data dari API
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak tersedia!");
      return;
    }

    axios
      .get(`http://localhost:4000/api/dashboard/my/profile?token=${token}`)
      .then((response) => {
        console.log("Response data:", response.data);
        this.username = response.data.username; // Mengisi username dari API
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });

    // Inisialisasi status koneksi
    this.statusLog();
  },
};
</script>

<style scoped>
/* Gaya CSS sesuai kebutuhan */
</style>
