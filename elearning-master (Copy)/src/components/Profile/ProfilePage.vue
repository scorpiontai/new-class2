<template>
  <div>
    <div class="container my-5 text-center">
      <h2 class="text-center mb-4">Status Pengguna</h2>
      <div v-if="userStatus.status">
        <h4>Status Pengguna: {{ userStatus.status }}</h4>
        <p>Tanggal: {{ userStatus.date }}</p>
        <p>Jam: {{ userStatus.hours }}:{{ userStatus.mins }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ProfilePage",
  data() {
    return {
      userStatus: {}
    };
  },
  mounted() {
    this.getUserStatus("userName");  // Ganti dengan nama yang sesuai
  },
  methods: {
    getUserStatus(name) {
      const query = `
        query {
          statusUser(name: "${name}") {
            status
            date
            hours
            mins
          }
        }
      `;
      axios.post('http://localhost:4000/api/graphql', { query })
        .then((response) => {
          if (response.data.data.statusUser) {
            this.userStatus = response.data.data.statusUser[0];
            console.log('Status Pengguna:', this.userStatus);
          }
        })
        .catch((error) => {
          console.error('Error fetching user status:', error);
        });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.status-container {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.status-container h4 {
  font-size: 18px;
  font-weight: bold;
}

.status-container p {
  font-size: 16px;
}
</style>
