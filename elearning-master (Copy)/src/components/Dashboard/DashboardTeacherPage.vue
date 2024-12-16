<template>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add" />
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Classroom</a>
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
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-for="(item, index) in navItems" :key="index">
              <a class="nav-link" :href="item.href">{{ item.name }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <img src="https://via.placeholder.com/32" class="profile-icon" alt="Profil" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Konten utama -->
    <div class="container mt-5">
      <h1 class="text-center mb-4">Daftar Mata Pelajaran</h1>

      <div class="container my-3">
        <h2 class="text-center mb-4">Daftar Kelas</h2>
        <div class="row g-4">
          <div class="col-md-6" v-for="(kelas, index) in kelasList" :key="index">
            <a :href="kelas.link">
              <div class="class-card">
                <div class="header">
                  <h5>{{ kelas.className }}</h5>
                  <p>{{ kelas.subject }}</p>
                </div>
                <div class="footer">
                  <p>Kode Kelas: {{ kelas.codeClass }}</p>
                  <p>Dibuat: {{ kelas.createdAt }}</p>
                  <p>Maks. Anggota: {{ kelas.maxMemb === 0 ? "belum diatur" : kelas.maxMemb }}</p>
                  <hr>
                  <p>Kelas ini dibuat oleh {{ kelas.teacher }} pada {{ kelas.createdAt }}, {{ kelas.timeAt }}</p>
                  <p>{{ kelas.description }}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <label for="read-more" class="read-more">read more</label>

    <div class="container mt-5">
      <div class="add-class">
        <a href="http://localhost:8080/make/class">
          <span class="material-symbols-outlined">
            add
          </span>
        </a>
        <div class="addclass">Add Class</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardTeacherPage",
  data() {
    return {
      navItems: [
        { name: "Beranda", href: "#" },
        { name: "Tugas", href: "#" },
        { name: "Kelas", href: "#" },
        { name: "Akun", href: "account.html" }
      ],
      kelasList: []
    };
  },
  mounted() {
    this.fetchKelasData();
    this.loadCDNs();
  },
  methods: {
    async fetchKelasData() {
      try {
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            query: `
              query {
                topOfClass(token: "${localStorage.getItem('token')}", type: "topClass") {
                  codeClass,
                  className,
                  subject,
                  createdAt,
                  description,
                  maxMemb
                }
              }
            `
          })
        });
        const result = await response.json();
        this.kelasList = result.data.topOfClass; 
      } catch (error) {
        console.error("Error fetching kelas data:", error);
      }
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
        scriptBootstrap.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js";
        scriptBootstrap.defer = true;
        document.head.appendChild(scriptBootstrap);
      }
    }
  }
};
</script>

<style scoped>
/* Bootstrap CDN Styles */
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");

.class-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  /* Latar belakang kartu putih */
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.class-card .header {
  background-color: #6c5ce7;
  /* Header ungu */
  color: #fff;
  padding: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}

.class-card .footer {
  padding: 15px;
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  text-align: left;
}

.read-more {
  color: #6c5ce7;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  text-align: center;
  margin-top: 10px;
  margin-left: 50%;
  cursor: pointer;
}

.read-more:hover {
  color: #1e00ff;
  text-decoration: none;
  font-weight: bold;
}

/* From Uiverse.io by OnCloud125252 */
/* Note that you only needs to edit the config to customize the button! */

.plusButton {
  /* Config start */
  --plus_sideLength: 2.5rem;
  --plus_topRightTriangleSideLength: 0.9rem;
  /* Config end */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  width: var(--plus_sideLength);
  height: var(--plus_sideLength);
  background-color: #000000;
  overflow: hidden;
}

.plusButton::before {
  position: absolute;
  content: "";
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-width: 0 var(--plus_topRightTriangleSideLength) var(--plus_topRightTriangleSideLength) 0;
  border-style: solid;
  border-color: transparent white transparent transparent;
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
}

.plusButton:hover {
  cursor: pointer;
}

.plusButton:hover::before {
  --plus_topRightTriangleSideLength: calc(var(--plus_sideLength) * 2);
}

.plusButton:focus-visible::before {
  --plus_topRightTriangleSideLength: calc(var(--plus_sideLength) * 2);
}

.plusButton > .plusIcon {
  fill: white;
  width: calc(var(--plus_sideLength) * 0.7);
  height: calc(var(--plus_sideLength) * 0.7);
  z-index: 1;
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
}

.plusButton:hover > .plusIcon {
  fill: black;
  transform: rotate(180deg);
}

.plusButton:focus-visible > .plusIcon {
  fill: black;
  transform: rotate(180deg);
}

.add-class {
  display: flex;
  align-items: center;
  gap: 5px;
}

.add-mapel {
  display: flex;
  align-items: center;
  gap: 5px;
}

.navbar-custom {
  background-color: #ffffff;
  /* Warna latar belakang putih */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Shadow untuk memberikan efek kedalaman */
}

.navbar-custom .navbar-brand {
  font-weight: bold;
  color: #4285F4;
  /* Warna biru */
}

.navbar-custom .navbar-nav .nav-link {
  color: #333;
  /* Warna teks item navigasi */
}

.navbar-custom .navbar-nav .nav-link:hover {
  color: #4285F4;
  /* Warna teks item navigasi saat hover */
}

.profile-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
