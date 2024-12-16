<template>
    <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Classroom</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#">Beranda</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Tugas</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Kelas</a></li>
                    <li class="nav-item"><a class="nav-link" href="account.html">Akun</a></li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <img src="https://via.placeholder.com/32" class="profile-icon" alt="Ikon Profil">
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container my-4">
        <h1 class="text-center mb-4">Tugas-Tugas</h1>

        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div class="col" v-for="task in tasks" :key="task.id">
                <div class="task-card shadow-sm rounded-3 p-3">
                    <h5 class="card-title">{{ task.title }}</h5>
                    <p class="card-text">{{ task.content }}</p>
                    <button v-if="task.urlfile && task.filePath" class="btn btn-primary btn-block">
                        <a :href="task.urlfile" class="text-white">Lihat Tugas</a>
                    </button>
                    <button v-if="!task.filePath && task.urlfile" class="btn btn-primary btn-block" @click="redirectToFile(task.urlfile)">
                        Lihat Tugas
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.navbar-custom {
    background-color: white;
    color: blue;
}

.navbar-brand {
    color: blue !important;
}

.nav-link {
    color: blue !important;
}

.navbar-custom .navbar-toggler-icon {
    background-color: blue;
}

.profile-icon {
    border-radius: 50%;
    height: 32px;
    width: 32px;
}

.task-card {
    border: 1px solid #ddd;
    transition: transform 0.2s;
}

.task-card:hover {
    transform: scale(1.05);
}
</style>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";

export default {
    name: "ListTugas",
    data() {
        return {
            classCode: null,
            socket: null,
            tasks: [],
            loading: true,
            showMoreTasks: true,
            taskTimeout: null,
        };
    },
    mounted() {
        this.classCode = this.$route.params.classCode;

        if (this.classCode) {
            this.checkClassValidity();
            this.initSocket(this.classCode);
        } else {
            this.redirectToDashboard("Class Code Tidak Ditemukan", "Pastikan Anda mengakses kelas yang benar.");
        }
    },
    methods: {
        initSocket(classCode) {
            this.socket = io("http://localhost:2000/stream");

            this.socket.on("connect", () => {
                console.log("Terhubung ke server socket:", this.socket.id);
                this.socket.emit("stream", { area: "streaming", code: classCode });
            });

            this.socket.on(`matery:${classCode}`, (data) => {
                console.log("Data diterima:", data);
                if (data && data.title && data.content) {
                    const task = {
                        id: data.id || Date.now(),
                        title: data.title || "Tugas Baru",
                        content: data.content || "Deskripsi tidak tersedia",
                        link: data.filePath ? "#" : data.link,
                        urlfile: data.urlfile || null,
                        filePath: data.filePath || null,
                    };
                    this.tasks.unshift(task);
                    this.showMoreTasks = false;

                    if (this.taskTimeout) clearTimeout(this.taskTimeout);
                    this.taskTimeout = setTimeout(() => {
                        this.showMoreTasks = true;
                    }, 5000);
                } else {
                    console.warn("Data yang diterima tidak valid:", data);
                }
            });

            this.socket.on("disconnect", () => {
                Swal.fire({
                    icon: "warning",
                    title: "Koneksi Terputus",
                    text: "Koneksi dengan server terputus. Silakan cek jaringan Anda.",
                });
            });
        },

        checkClassValidity() {
            const token = localStorage.getItem("token");
            axios
                .get(`http://localhost:4000/api/classroom/are/inMyClass/${this.classCode}?token=${token}`)
                .then((response) => {
                    if (!response.data.message) {
                        this.redirectToDashboard("Aksi Tidak Valid", "Anda tidak memiliki akses ke kelas ini.");
                    } else {
                        this.loading = false;
                        this.fetchTasksFromAPI();
                    }
                })
                .catch((error) => {
                    console.error("Error fetching class data:", error);
                    this.redirectToDashboard("Terjadi Kesalahan", "Tidak dapat memverifikasi kelas.");
                });
        },

        fetchTasksFromAPI() {
            axios
                .get(`http://localhost:2000/api/list/matery/${this.classCode}`)
                .then((response) => {
                    const data = response.data;
                    if (data && Array.isArray(data)) {
                        this.tasks = data.map((task) => ({
                            id: task.id || Date.now(),
                            title: task.title,
                            content: task.content,
                            filePath: task.filePath,
                            urlfile: task.filePath ? null : `http://localhost:2000/api/show/video/${this.classCode}/${this.title}/?id=${task.id}`,
                        }));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching tasks:", error);
                });
        },

        redirectToFile(url) {
            window.location.href = url;
        },

        redirectToDashboard(title, text) {
            Swal.fire({ icon: "error", title, text }).then(() => {
                this.$router.push("/dashboard");
            });
        },
    },
};
</script>
