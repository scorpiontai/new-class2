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
                        <a class="nav-link" href="#"><img src="https://via.placeholder.com/32" class="profile-icon" alt="Profil"></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container my-5">
        <h1 class="text-center mb-4">Join Kelas Baru</h1>
        <div class="card mx-auto" style="max-width: 600px;">
            <div class="card-body">
                <form @submit.prevent="joinClass">
                    <div class="mb-3">
                        <label for="classCode">Kode Kelas</label>
                        <input 
                            type="text" 
                            id="classCode" 
                            v-model="classCode" 
                            class="form-control" 
                            placeholder="Masukkan kode kelas" 
                            required 
                        />
                    </div>
                    <div class="d-flex justify-content-center gap-3 mt-3">
                        <button type="submit" class="butt align-items-center d-flex">
                            <a class="links text-center">Join Kelas</a>
                            <div class="arrow-wrapper">
                                <div class="arrow"></div>
                            </div>
                        </button>
                        <button type="button" @click="cancelJoin" class="butto align-items-center d-flex">
                            <a class="links">Batal</a>
                            <div class="arrow-wrapper">
                                <div class="arrow"></div>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'JoinClass',
    data() {
        return {
            classCode: '',
        };
    },
    methods: {
        async joinClass() {
            const token = localStorage.getItem("token");
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Token Tidak Ditemukan',
                    text: 'Silakan login terlebih dahulu.',
                });
                return;
            }
            try {
                const response = await axios.post(`http://localhost:4000/api/classroom/join/addClass?token=${token}`, {
                    code: this.classCode
                });

                const { message } = response.data;

                if (response.data.message) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: message|| 'Anda telah bergabung ke kelas!',
                    }).then(() => {
                        this.$router.push('/dashboard');
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: message|| 'Gagal bergabung ke kelas.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Kesalahan',
                    text: error.response?.data?.message || 'Terjadi kesalahan saat mengirim data.',
                });
            }
        },
        cancelJoin() {
            this.$router.push('/dashboard');
        },
    },
};
</script>
