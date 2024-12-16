<template>
  <body>
    <div class="wrapper">
      <form class="login-container" @submit.prevent="handleLogin">
        <h2 class="title">Login</h2>
        <div class="input-container">
          <input
            id="input-login"
            type="text"
            name="username"
            placeholder="Username"
            v-model="loginData.username"
          />
        </div>
        <div class="input-container">
          <input
            id="input-login"
            type="password"
            name="password"
            placeholder="Password"
            v-model="loginData.password"
          />
        </div>
        <div class="input-container">
          <input
            id="input-login"
            type="password"
            name="confirmpw"
            placeholder="type again"
            v-model="loginData.confirmPassword"
          />
        </div>
        <div class="remember">
          <input type="checkbox" v-model="loginData.rememberMe" />
          Remember me
        </div>
        <div class="captcha-container">
          <p v-if="info" class="captcha">{{ info.numberOne }}</p>
          <span v-if="info" class="captcha-operator">+</span>
          <p v-if="info">{{ info.numberTwo }}</p>
          <input
            id="input-login"
            type="text"
            placeholder="Enter Captcha"
            name="answer"
            v-model="loginData.captchaAnswer"
          />
        </div>
        <p id="signup1">Don't have an account? </p>
        <router-link to="/signup" id="signup">Sign up here</router-link>
        <button type="submit" class="loginbtn">login</button>
      </form>
    </div>
  </body>
</template>

<script>
import textFile from "!!raw-loader!../file.txt";

let arr;
export default {
  name: "LoginForm",
  data() {
    arr = textFile;
    return {
      info: null,
      loginData: {
        username: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
        captchaAnswer: ""
      }
    };
  },
  mounted() {
    fetch(`${arr}/captcha/general`, {
      method: "GET",
    })
      .then(response => {
        console.log("Status:", response.status);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        this.info = data;
        console.log(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  },
  methods: {
    handleLogin() {
      const { username, password, confirmPassword, rememberMe, captchaAnswer } = this.loginData;


      if (!username || !password || !captchaAnswer) {
        alert("Please fill out all required fields.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      fetch(`${arr}/api/login/elearning`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username:username,
          pw:password,
          remember:rememberMe,
          captcha:captchaAnswer,
          numberOne:this.info.numberOne,
          numberTwo: this.info.numberTwo
        })
      })
        .then(response => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
})
.then(data => {
  const { message, keys } = data;

  localStorage.setItem("token", keys)
  alert(message);
})
.catch(error => {
  console.error("There was an error:", error);
});
    }
  } 
}
</script>

<style scoped>
body {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  background: linear-gradient(to top, #a8e6cf, #fff9b1);
  background-size: cover;
}

.wrapper {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #91c2ed;
  border-radius: 8px;
  box-shadow: 0 30px 8px rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.input-container {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-container input {
  width: 100%;
  padding: 10px 1px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-container input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 10px rgba(49, 97, 151, 0.5);
}

.input-container label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

#input-login {
  border-radius: 1px;
  margin-left: 5px;
}

.loginbtn {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #4a90e2;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.3s, transform 0.2s;
  transition: transform 0.1s ease-in-out;
}

.loginbtn:hover {
  background-color: #357ab8;
  transform: scale(0.95);
}

.loginbtn:active {
  transform: scale(0.9);
}

.loginbtn:focus {
  outline: 2px solid #6cb3ff;
  outline-offset: 2px;
}

.remember {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  margin: 10px 0;
}

.remember input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  position: relative;
  transition: all 0.3s ease;
}

.remember input[type="checkbox"]:checked {
  background-color: #4a90e2;
  border-color: #4a90e2;
}

.remember input[type="checkbox"]:checked::after {
  content: "✓";
  color: white;
  font-size: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  line-height: 1;
}

#signup {
  color: white;
  text-decoration: underline;
  font-size: 14px;
  display: inline-block;
  transition: color 0.3s ease-in-out;
  margin-bottom: 10px;
}

#signup:hover {
  color: #357ab8;
}

#signup1 {
  color: white;
  text-decoration: none;
  font-size: 14px;
  margin-top: 10px;
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 7px;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.captcha-operator {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
