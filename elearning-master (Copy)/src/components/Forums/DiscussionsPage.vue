<template>
  <div>
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
            <li class="nav-item">
              <router-link to="/" class="nav-link">Beranda</router-link>
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

    <!-- Button Toggle for General and Task -->
    <div class="container my-5 text-center">
      <h2>Diskusi</h2>
      <div class="mb-3">
        <button 
          class="btn btn-primary" 
          @click="switchTab('general')"
          :class="{'active': activeTab === 'general'}"
        >
          General
        </button>
        <button 
          class="btn btn-secondary" 
          @click="switchTab('task')"
          :class="{'active': activeTab === 'task'}"
        >
          Task
        </button>
      </div>

      <!-- Display Form based on Active Tab -->
      <div v-if="activeTab === 'general'">
        <h3>General Discussion</h3>
        
        <!-- Chat Messages Display -->
        <div class="messages">
          <div class="message" v-for="(message, index) in generalMessages" :key="index">
            <div class="username">{{ message.username }}</div>
            <div class="timestamp">{{ message.timestamp }}</div>
            <div class="text">{{ message.text }}</div>
          </div>
        </div>

        <!-- Input Form for Sending Messages -->
        <form @submit.prevent="submitDiscussion('general')">
          <div class="mb-3">
            <label for="generalInput" class="form-label">Masukkan Pesan:</label>
            <textarea
              id="generalInput"
              v-model="generalMessage"
              class="form-control"
              rows="1"
              @input="adjustInputHeight"
              placeholder="Tulis pesan..."
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Kirim</button>
        </form>
      </div>

      <div v-if="activeTab === 'task'">
        <h3>Task Discussion</h3>
        
        <!-- Chat Messages Display -->
        <div class="messages">
          <div class="message" v-for="(message, index) in taskMessages" :key="index">
            <div class="username">{{ message.username }}</div>
            <div class="timestamp">{{ message.timestamp }}</div>
            <div class="text">{{ message.text }}</div>
          </div>
        </div>

        <!-- Input Form for Sending Messages -->
        <form @submit.prevent="submitDiscussion('task')">
          <div class="mb-3">
            <label for="taskInput" class="form-label">Masukkan Pesan Tugas:</label>
            <textarea
              id="taskInput"
              v-model="taskMessage"
              class="form-control"
              rows="1"
              @input="adjustInputHeight"
              placeholder="Tulis pesan tugas..."
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Kirim</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import io from 'socket.io-client';

export default {
  name: "DiscussionsPage",
  data() {
    return {
      activeTab: 'general', // Initial tab
      generalMessage: '',
      taskMessage: '',
      generalMessages: [
        { username: 'Lawn', timestamp: new Date().toLocaleString(), text: 'Hello, how are you?' },
        { username: 'Saya', timestamp: new Date().toLocaleString(), text: 'I am good, thanks!' }
      ],
      taskMessages: [],
      username: 'Saya', // Replace with dynamic username logic if needed
      classCode: 'exampleClassCode', // Adjust as necessary
      socket: null,
    };
  },
  mounted() {
    this.initializeSocket();
    this.checkClassValidity();
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab; // Switch between 'general' and 'task'
    },
    adjustInputHeight(event) {
      // Auto-resize input based on content
      const textarea = event.target;
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight) + 'px';
    },
    submitDiscussion(tab) {
      const timestamp = new Date().toLocaleString(); // Timestamp for the message
      if (tab === 'general') {
        this.generalMessages.push({
          username: this.username,
          timestamp: timestamp,
          text: this.generalMessage,
        });
        this.generalMessage = ''; // Clear input
      } else if (tab === 'task') {
        this.taskMessages.push({
          username: this.username,
          timestamp: timestamp,
          text: this.taskMessage,
        });
        this.taskMessage = ''; // Clear input
      }
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
    checkClassValidity() {
      axios.get(`http://localhost:4000/api/classroom/are/inMyClass/${this.classCode}?token=${localStorage.getItem("token")}`)
        .then((response) => {
          if (response.data.message !== true) {
            Swal.fire({
              icon: 'error',
              title: 'Aksi Tidak Valid',
              text: 'Anda tidak memiliki akses ke kelas ini.',
            }).then(() => {
              this.$router.push('/dashboard');
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching class data:', error);
          Swal.fire({
            icon: 'error',
            title: 'Terjadi Kesalahan',
            text: 'Tidak dapat memverifikasi kelas.',
          });
        });
    },
  },
};
</script>

<style scoped>
/* Navbar Styling */
.navbar-custom {
  background-color: #ffffff; /* Background putih */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-custom .navbar-brand {
  font-weight: bold;
  color: #6c63ff; /* Biru softy */
}

.navbar-custom .navbar-brand:hover {
  color: #5a54e0;
}

.navbar-custom .nav-link {
  color: #5f6368;
  font-size: 16px;
}

.navbar-custom .nav-link:hover {
  color: #4285F4;
}

.navbar-custom .profile-icon {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
}

/* Button Styling */
button.active {
  background-color: #6c63ff;
  color: white;
}

button {
  margin: 0 10px;
}

/* Form Styling */
.container {
  max-width: 100%; /* Perlebar container */
  width: 80%; /* Atur lebar sesuai kebutuhan */
}

.form-label {
  font-weight: bold;
}

form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

/* Message Display */
.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
  width: 100%; /* Perlebar pesan */
}

.message {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.username {
  font-weight: bold;
}

.timestamp {
  font-size: 12px;
  color: gray;
}

.text {
  margin-top: 5px;
}

/* Auto-resize Textarea */
textarea {
  resize: none;
  width: 100%; /* Perlebar input */
}
</style>
