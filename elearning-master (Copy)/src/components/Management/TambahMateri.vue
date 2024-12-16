<template>
    <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Classroom</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link to=""></router-link>
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
                        <a class="nav-link" href="#">
                            <img :src="profileImageUrl" class="profile-icon" alt="Profil">
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container my-5">
        <h2 class="mb-4 text-center">Buat Materi Baru</h2>
        <form @submit.prevent="submitting">
            <div class="mb-3">
                <label for="judul" class="form-label">Judul</label>
                <input type="text" class="form-control" id="judul" v-model="judul" placeholder="Masukkan judul" required>
            </div>
            <div class="mb-3">
                <label for="deskripsi" class="form-label">Deskripsi</label>
                <textarea class="form-control" id="deskripsi" v-model="deskripsi" rows="3" placeholder="Masukkan deskripsi" required></textarea>
            </div>
            <div class="mb-3">
                <label for="fileInput" class="form-label">Pilih File</label>
                <input class="form-control" type="file" id="fileInput" @change="handleFileUpload">
            </div>
            <iframe v-if="file" :src="fileUrl" frameborder="0" width="100%" height="400px"></iframe>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>

   <div class="container my-5">
    <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action active">
            List Murid
        </a>
     <template v-if="nameLists.length > 0">
<a 
    v-for="(name, index) in nameLists" 
    :key="index" 
    :href="`http://localhost:8080/list/member/${name}`" 
    class="list-group-item list-group-item-action d-flex align-items-center">
    
    <!-- Gambar dengan ukuran seperti favicon -->
    <img 
        :src="`http://localhost:2000/profile/all/image/profile/${name}`" 
        alt="Profile Picture" 
        class="rounded-circle me-2" 
        style="width: 32px; height: 32px; object-fit: cover;">
    
    {{ name }}
</a>

</template>
    
        <template v-else>
            <a href="#" class="list-group-item list-group-item-action text-center">
                Tidak ada murid dalam daftar.
            </a>
        </template>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

export default {
    name: 'TambahMateri',
    props: ['classCode'],
    data() {
        return {
            judul: '',
            deskripsi: '',
            file: null,
            fileUrl: '',
            nameLists: [], 
            profileImageUrl: 'https://via.placeholder.com/32', // Default profile image URL
            socket: null,
        };
    },
    mounted() {
        this.areInMyClass();
        this.fetchMemberList(); 
        this.initializeSocket();
    },
    methods: {
        async areInMyClass() {
            try {
                const response = await axios.get(`http://localhost:4000/api/classroom/are/inMyClass/${this.classCode}?token=${localStorage.getItem("token")}`);
                if (response.data.message !== true) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Akses Ditolak',
                        text: 'Anda tidak terdaftar di kelas ini.',
                        confirmButtonText: 'Login Ulang'
                    }).then(() => {
                        window.location.href = 'http://localhost:8080/login';
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Kesalahan',
                    text: 'Gagal memeriksa status kelas. Silakan coba lagi.',
                });
                console.error("Error saat memeriksa kelas:", err.message);
            }
        },
        async fetchMemberList() {
            try {
                const response = await axios.get(`http://localhost:4000/api/dashboard/list/member?classCode=${this.classCode}`);
                if (response.data.nameLists && Array.isArray(response.data.nameLists)) {
                    this.nameLists = response.data.nameLists;
                } else {
                    this.nameLists = [];
                    Swal.fire({
                        icon: 'info',
                        title: 'Tidak Ada Data',
                        text: 'Daftar murid kosong atau tidak tersedia.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Kesalahan',
                    text: 'Gagal memuat daftar murid. Silakan coba lagi.',
                });
                console.error("Gagal memuat daftar murid:", error.message);
                this.nameLists = [];
            }
        },
        async submitting() {
            try {
                const formData = new FormData();

                if (this.file) {
                    formData.append('file', this.file);
                    formData.append('title', this.judul); 

    
                    const fileExtension = this.file.name.split('.').pop().toLowerCase();
                    const allowedExtensions = ['mp4', 'pdf', 'pptx', 'docx', 'xlsc'];

                    if (!allowedExtensions.includes(fileExtension)) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'File Tidak Valid!',
                            text: 'Hanya file dengan format MP4, PDF, PPTX, DOCX, atau XLSC yang diperbolehkan.',
                        });
                        return; 
                    }
                }

                // Kirim socket secara opsional
                this.socket.emit('matery', {
                    codeClass: this.classCode,
                    title: this.judul,
                    content: this.deskripsi,
                    filePath: "path",
                    tag: 'tes',
                    message: 'yang rajin ya',
                    originalName: this.file ? this.file.name : null,
                    originalPath: this.file ? this.file.name.split('.').pop() : null
                });

                // Kirim file jika ada
                if (this.file) {
                    const response = await axios.post(
                        `http://localhost:2000/api/up/${this.classCode}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    console.log("File dan data berhasil diunggah:, kunjungi link berikut untuk membuka", response.data.id);
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'File dan data berhasil diunggah.',
                    });
                }

                // Kirim notifikasi
                await axios.post(`http://localhost:4000/api/log/notif/controll?token=${localStorage.getItem("token")}`, {
                    resource: this.classCode,
                    data: `Ada materi baru di ${this.classCode}, nih!`,
                    classCode: this.classCode
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mengunggah',
                    text: 'Terjadi kesalahan saat mengunggah data.',
                });
                console.error("Error saat mengunggah data:", error);
            }
        },
        handleFileUpload(event) {
            this.file = event.target.files[0];
            this.fileUrl = URL.createObjectURL(this.file); // Menampilkan preview file
        },
        initializeSocket() {
            this.socket = io('http://localhost:2000/stream');

            this.socket.on('connect', () => {
                console.log('Terhubung ke server socket:', this.socket.id);

                this.socket.emit('stream', { area: 'streaming', code: this.classCode });
            });

            this.socket.on(`matery:${this.classCode}`, (data) => {
                console.log("response", data);
            });

            this.socket.on('disconnect', () => {
                console.log('Koneksi socket terputus.');
                Swal.fire({
                    icon: 'warning',
                    title: 'Koneksi Terputus',
                    text: 'Koneksi dengan server terputus. Silakan cek jaringan Anda.',
                });
            });
        },
    }
};
</script>
