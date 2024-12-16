<template>
    <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid">
            <!-- Logo dan Brand -->
            <a class="navbar-brand" href="#">Classroom</a>
            
            <!-- Tombol Burger (untuk mobile) -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
    
            <!-- Menu Navigasi -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link to="/dashboard/teacher" class="nav-link">Beranda</router-link>
                        <a class="nav-link" href="#">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <router-link to="" class="nav-link">Tugas</router-link>
                        <a class="nav-link" href="#">Tugas</a>
                    </li>
                    <li class="nav-item">
                        <router-link to="" class="nav-link">Kelas</router-link>
                        <a class="nav-link" href="#">Kelas</a>
                    </li>
                    <li class="nav-item">
                        <router-link to="/profile" class="nav-link">Akun</router-link>
                        <a class="nav-link" href="account.html">Akun</a>
                    </li>
                    <li class="nav-item">
                        <!-- Ikon Profil -->
                        <img src="https://via.placeholder.com/32" class="profile-icon" alt="Profil">
                        <a href=""></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container-fluid">
        <h1>Nama Siswa : </h1>
        <h2>Kelas : </h2>
        <iframe src="" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    name: "StreamingTeacher"

}
</script>

<style scoped>
    .navbar-custom {
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
}
.navbar-custom .navbar-brand {
    font-weight: bold;
    color: #4285F4;
}
.navbar-nav .nav-link {
    color: #5f6368;
}
.navbar-nav .nav-link:hover {
    color: #4285F4; 
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

</style>