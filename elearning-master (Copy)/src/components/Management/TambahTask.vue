<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <div id="app">
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
                <img src="https://via.placeholder.com/32" class="profile-icon" alt="Profil" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container my-5">
      <div class="text-center mb-4">
        <h1 class="display-4">Buat Tugas Baru</h1>
        <p class="lead">Silakan buat tugas baru dan lihat daftar tugas yang sudah dibuat.</p>
      </div>

      <!-- Form untuk membuat tugas -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title">Form Tugas</h5>
          <form id="tugasForm" @submit.prevent="submitTask">
            <div class="mb-3">
              <label for="tugasName" class="form-label">Nama Tugas</label>
              <input type="text" class="form-control" id="tugasName" v-model="taskName" required>
            </div>
            <div class="mb-3">
              <label for="tugasDeskripsi" class="form-label">Deskripsi Tugas</label>
              <textarea class="form-control" id="tugasDeskripsi" v-model="taskDescription" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label for="tugasDeadline" class="form-label">Deadline</label>
              <input type="datetime-local" class="form-control" id="tugasDeadline" v-model="taskDeadline" required>
              <input type="checkbox" v-model="isStreaming">
              <label for="checkbox">Aktifkan streaming</label>
            </div>
            <button type="submit" class="btn btn-primary">Buat Tugas</button>
          </form>
        </div>
      </div>

      <!-- Daftar Tugas -->
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Daftar Tugas</h5>
          <ul id="tugasList" class="list-group">
            <li v-for="task in tasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
              {{ task.name }}
              <button @click="deleteTask(task.id)" class="btn btn-danger btn-sm">Hapus</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TambahTugas",
  data() {
    return {
      taskName: "",
      taskDescription: "",
      taskDeadline: "",
      isStreaming: false,
      tasks: [],
    };
  },
  methods: {
    submitTask() {
      if (!this.taskName || !this.taskDescription || !this.taskDeadline) return;

      const newTask = {
        id: Date.now(),
        name: this.taskName,
        description: this.taskDescription,
        deadline: this.taskDeadline,
        streaming: this.isStreaming,
      };

      this.tasks.push(newTask);

      // Reset form
      this.taskName = "";
      this.taskDescription = "";
      this.taskDeadline = "";
      this.isStreaming = false;
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    loadCDNs() {
      if (typeof window !== "undefined") {
        // Memuat Popper.js
        const scriptPopper = document.createElement("script");
        scriptPopper.src = "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js";
        scriptPopper.defer = true;
        document.head.appendChild(scriptPopper);

        // Memuat Bootstrap.js
        const scriptBootstrap = document.createElement("script");
        scriptBootstrap.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
        scriptBootstrap.defer = true;
        document.head.appendChild(scriptBootstrap);
      }
    },
  },
  mounted() {
    this.loadCDNs(); // Memuat CDN saat komponen di-mount
  },
};
</script>

<style scoped>
/* styles.css */
.navbar-custom {
  background-color: #ffffff; /* Warna latar belakang putih */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Shadow untuk memberikan efek kedalaman */
}
.navbar-custom .navbar-brand {
  font-weight: bold;
  color: #4285F4; /* Warna biru seperti Google */
}
.navbar-nav .nav-link {
  color: #5f6368; /* Warna teks link abu-abu */
  font-size: 16px;
}
.navbar-nav .nav-link:hover {
  color: #4285F4; /* Warna biru saat hover */
}
.navbar-custom .profile-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.navbar-custom .nav-item .nav-link {
  padding-left: 20px;
  padding-right: 20px;
}
body {
  font-family: 'Roboto', sans-serif;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
}

.list-group-item {
  margin-bottom: 10px;
}

.list-group-item button {
  background-color: transparent;
  border: none;
  color: red;
  cursor: pointer;
}
</style>
