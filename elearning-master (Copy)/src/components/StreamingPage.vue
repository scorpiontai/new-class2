  <template>
    <div>
      <h1>Hello from MyComponent!</h1>
      <p>{{ message }}</p>
      <button class="btn btn-success" v-if="!isStreaming" @click="startStream">Start Stream</button>
      <button class="btn btn-danger" v-else @click="pauseStream">Pause</button>
      <div v-if="responseData">
        <p>Response: {{ responseData }}</p>
      </div>
    </div>
  </template>

  <script>
  import axios from "axios";
  import textFile from "!!raw-loader!./file.txt";

  export default {
    name: "StreamingPage",
    data() {
      return {
        message: "This is a message from MyComponent.",
        responseData: null,
        classCode: this.$route.params.classCode,
        isStreaming: false,
      };
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get(`${textFile}/task/page/${this.classCode}`, {
            params: {
              type: this.$route.query.type,
              user: this.$route.query.user,
              onStream: this.isStreaming ? 1 : 0, 
            },
          });

          this.responseData = response.data;
        } catch (error) {
          if (error.response && error.response.status === 403) {
            alert("Access forbidden. Please start streaming.");
            this.isStreaming = false; 
          } else {
            console.error("Error fetching data:", error);
          }
        }
      },
      async startStream() {
        try {
          await axios.post(`${textFile}/task/page/${this.classCode}`, null, {
            params: {
              onStream: 1,
            },
          });

          this.isStreaming = true; 
          alert("Streaming started!");
          this.fetchData(); 
        } catch (error) {
          console.error("Error starting stream:", error);
        }
      },
      async pauseStream() {
        try {
          await axios.post(`${textFile}/task/page/${this.classCode}`, null, {
            params: {
              onStream: 0,
            },
          });

          this.isStreaming = false; 
          alert("Streaming paused!");
          this.fetchData(); 
        } catch (error) {
          console.error("Error pausing stream:", error);
        }
      },
    },
    mounted() {
      this.fetchData(); 
    },
  };
  </script>

  <style scoped>
  h1 {
    color: blue;
  }
  </style>
