<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'StreamingCatch',

  data() {
    return {
      title: 'Hello from Vue.js',
      message: 'This is a simple Vue component.',
    };
  },

  methods: {},

  mounted() {
    console.log('Socket.IO CDN loaded');
    
    const socket = io('http://localhost:4000/stream', {
            transports: ['websocket'],
            withCredentials: true,
        });
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      
      console.log("debug param", this.$route.params.classCode)

      socket.emit("catch", {code:this.$route.params.classCode})


      socket.on(`catch`, (data) => {
        console.log('Received data:', data);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });
    });
  },
};
</script>

<style scoped>

</style>
