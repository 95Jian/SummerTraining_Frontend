<template>
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <div>
          <input v-model="username" type="text" placeholder="Username" />
        </div>
        <div>
          <input v-model="password" type="password" placeholder="Password" />
        </div>
        <div>
          <button @click="login">Login</button>
        </div>
        <div>
          <a href="#" @click="showRegister">Register</a>
        </div>
        <p v-if="message">{{ message }}</p>
      </div>
      <register-dialog v-if="showRegisterDialog" @close="showRegisterDialog = false" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import RegisterDialog from './UserRegister.vue';
  
  export default {
    components: { RegisterDialog },
    data() {
      return {
        username: '',
        password: '',
        message: '',
        showRegisterDialog: false,
      };
    },
    methods: {
      login() {
        axios.post('/api/login', {
          username: this.username,
          password: this.password,
        }).then(response => {
          if (response.data.success) {
            this.message = 'Login successful!';
          } else {
            this.message = `Login failed: ${response.data.message}`;
          }
        }).catch(error => {
          this.message = `Error: ${error.response.data.message || error.message}`;
        });
      },
      showRegister() {
        this.showRegisterDialog = true;
      },
    },
  };
  </script>
  
  <style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .login-box {
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  