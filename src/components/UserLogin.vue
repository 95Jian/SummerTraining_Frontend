<template>
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <div>
          <input v-model="user_name" type="text" placeholder="Username" />
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
        user_name: '',
        password: '',
        message: '',
        showRegisterDialog: false,
        URL:'http://localhost:8080',
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post(`${this.URL}/user/login`, {
            user_name: this.user_name,
            password: this.password,
          });
          console.log('Full Response:', response);
          if (response && response.data && response.data.success) {
            alert('登录成功!');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            this.$router.push('/dashboard');
          } else {
            this.message = `登录失败: ${response.data ? response.data.message : '未知错误'}`;
          }
        } catch (error) {
          console.error('Login error:', error);
          this.message = `Error: ${error.response ? (error.response.data.message || error.message) : error.message}`;
        }
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
  