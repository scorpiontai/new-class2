<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add" />
  <div id="app">
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
              <span id="notif" v-if="condition">
                {{ notificationCount }}
              </span>
              <a class="nav-link" href="#">
                <img src="https://via.placeholder.com/32" class="profile-icon" alt="Profil" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Daftar Mata Pelajaran</h1>
      <div class="container my-3">
        <h2 class="text-center mb-4">Daftar Kelas</h2>
        <div class="row g-4" id="kelas-container">
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
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <label for="readMore" @click="readMore">Read More</label>
    <div class="container mt-5">
      <div class="add-class">
        <a href="http://localhost:8080/dashboard/student/join">
          <span class="material-symbols-outlined">
            add
          </span>
        </a>
        <div class="addclass">Join Class</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import textFile from "!!raw-loader!../file.txt";
import io from 'socket.io-client'

let arr;
export default {
  name: "DashboardStudentPage",
  data() {
    arr = textFile;
    return {
      navItems: [
        { name: "Beranda", href: "#" },
        { name: "Tugas", href: "#" },
        { name: "Kelas", href: "#" },
        { name: "Akun", href: "account.html" },
      ],
      kelasList: [],
      isDescriptionExpanded: [],
      condition: false,
      notificationCount: 0,  // Menyimpan jumlah notifikasi
    };
  },
  mounted() {
    this.initializeSocket();
    this.onlineOffline(localStorage.getItem("token"));
    axios
      .get(`${arr}/api/dashboard/profile/auth?token=${localStorage.getItem("token")}`)
      .then((response) => {
        console.debug(response.status === 500);
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 500") {
          window.location.href = `http://localhost:8080/login`;
        }
      });
    this.fetchKelasData();
    this.loadCDNs();
    this.profile();
    this.listTeaecher();
    this.notifCondition();
  },
  methods: {
    async profile() {
      try {
        const find = await axios.get(
          `http://localhost:4000/api/dashboard/profile/auth?token=${localStorage.getItem("token")}`
        );
        if (find.data.message === false)
          window.location.href = `http://localhost:8080/login`;
      } catch (error) {
        console.error(error.message);
      }
    },
    async listTeaecher() {
      try {
        const find = await axios.get(
          `http://localhost:4000/api/dashboard/your/teacher?token=${localStorage.getItem("token")}`
        );
        return find.data.data;
      } catch (error) {
        console.error(error.message);
      }
    },
    async onlineOffline(token) {
      const url = "http://localhost:4000/graphql";
      const mutationOnline = `
        mutation {
            inputLog(userName: "${token}", status: "online") {
                status
            }
        }
      `;
      const mutationOffline = `
        mutation {
            inputLog(userName: "${token}", status: "offline") {
                status
            }
        }
      `;
      window.addEventListener("load", async () => {
        await axios.post(url, { query: mutationOnline });
      });
      window.addEventListener("online", async () => {
        await axios.post(url, { query: mutationOnline });
      });
      window.addEventListener("offline", async () => {
        await axios.post(url, { query: mutationOffline });
      });
      window.addEventListener("beforeunload", async () => {
        await axios.post(url, { query: mutationOffline });
      });
    },
    async fetchKelasData() {
      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            query: `
              query {
                topOfClass(token: "${localStorage.getItem("token")}", type: "topClass", next: "false") {
                  className,
                  limitted,
                  subject,
                  description,
                  maxMemb,
                  createdAt,
                  codeClass
                }
              }
            `,
          }),
        });
        const result = await response.json();
        this.kelasList = result.data.topOfClass;
        this.isDescriptionExpanded = new Array(this.kelasList.length).fill(false);
      } catch (error) {
        console.error("Error fetching kelas data:", error);
      }
    },
    async readMore() {
      try {
        const lastLimitted = this.kelasList[this.kelasList.length - 1]?.limitted || "false";
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            query: `
              query {
                topOfClass(token: "${localStorage.getItem("token")}", type: "topClass", next: "${lastLimitted}") {
                  className,
                  limitted,
                  subject,
                  description,
                  maxMemb,
                  createdAt,
                  codeClass
                }
              }
            `,
          }),
        });
        const result = await response.json();
        const newClasses = result.data.topOfClass;
        newClasses.forEach((kelas) => {
          this.kelasList.push(kelas);
          this.isDescriptionExpanded.push(false);
        });
      } catch (error) {
        console.error("Error fetching more classes:", error);
      }
    },
    toggleDescription(index) {
      this.isDescriptionExpanded[index] = !this.isDescriptionExpanded[index];
    },
    loadCDNs() {
      if (typeof window !== "undefined") {
        const scriptPopper = document.createElement("script");
        scriptPopper.src = "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js";
        scriptPopper.defer = true;
        document.head.appendChild(scriptPopper);
        const scriptBootstrap = document.createElement("script");
        scriptBootstrap.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js";
        scriptBootstrap.defer = true;
        document.head.appendChild(scriptBootstrap);
      }
    },
    async initializeSocket() {
      this.socket = io("http://localhost:2000/stream");
      this.socket.on("connect", () => {
        console.log("Terhubung ke server socket:", this.socket.id);
      });
      const teacherList = await this.listTeaecher();
      teacherList.forEach((item) => {
        this.socket.emit("stream", { area: "notif", code: item });
      });
      this.socket.on("disconnect", () => {
        console.log("Koneksi socket terputus");
      });
    },
    async notifCondition() {
      this.condition = false;
      const teacherList = await this.listTeaecher();
      teacherList.forEach((item) => {
        this.socket.on(`${item}:notif`, (data) => {
          if (data) {
            this.condition = true;
            this.incrementNotificationCount();
          }
        });
      });
    },
    incrementNotificationCount() {
      this.notificationCount += 1;
      localStorage.setItem("notificationCount", this.notificationCount); // Simpan di localStorage
    },
  },
};
</script>
<style scoped>
/* Bootstrap CDN Styles */
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");

/* Styles for class card */
.class-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
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

/* Custom Button Styles */
.add-class {
  display: flex;
  align-items: center;
  gap: 5px;
}

.profile-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

/* Navbar Styling */
.navbar-custom {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-custom .navbar-brand {
  font-weight: bold;
  color: #4285F4;
}

.navbar-custom .navbar-nav .nav-link {
  color: #333;
}

.navbar-custom .navbar-nav .nav-link:hover {
  color: #4285F4;
}
</style>
