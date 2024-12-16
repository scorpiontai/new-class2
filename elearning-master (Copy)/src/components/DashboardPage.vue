<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <p>tunggu...sedang mengarahkan anda</p>
    <div v-if="apiData">
      <h3>Data dari API:</h3>
      <pre>{{ apiData }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import textFile from "!!raw-loader!./file.txt";

let arr
export default {
  name: 'DashboardPage',
    mounted() {
      arr = textFile
    this.fetchData()
    },
  methods: {
    fetchData() {
  const token = localStorage.getItem("token")
     axios.get(`${arr}/api/classroom/find/metadata?token=${token}`)
  .then(response => {
   
    this.apiData = response.data; 
    console.log(this.apiData);

    
    let redirect = this.apiData.role.role === "Teacher" ? '/dashboard/teacher' : '/dashboard/student';  

  
    this.$router.push(redirect);  
  })
  .catch(error => {
   
    if (error.response && error.response.status === 403) {
      console.log('Akses ditolak, redirect ke halaman login');
      window.location.href = 'http://localhost:8080/login'; 
    } else {
  
      console.debug('Error:', error.message);
    }
  });

    },
  },
};
</script>

<style scoped>
h1 {
  color: #42b983;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
