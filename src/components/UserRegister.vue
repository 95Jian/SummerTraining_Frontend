<template>
    <div class="register-container">
      <div class="register-box">
        <h2>Register</h2>
        <div>
          <input v-model="user_name" type="text" placeholder="Username" />
        </div>
        <div>
          <input v-model="password" type="password" placeholder="Password" />
        </div>
        <div>
          <button @click="register">Register</button>
        </div>
        <p v-if="message">{{ message }}</p>
        <button @click="$emit('close')">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        user_name: '',
        password: '',
        email: '',
        message: '',
        URL:'http://localhost:8080',
      };
    },
    methods: {
      register() {
        axios.post(`${this.URL}/user/register`, {
          user_name: this.user_name,
          password: this.password,
        }).then(response => {
          if (response.data.success) {
            this.message = '注册成功！';
            this.$emit('close');
            setTimeout(() => {
            alert(this.message);
            }, 100);
          } else {
            this.message = `${response.data.message}`;
          }
        }).catch(error => {
            if (error.response) {
              // 请求发出后服务器有响应但状态码不是 2xx
             this.message = `Error: ${error.response.data.message || error.message}`;
            } else if (error.request) {
              // 请求发出但没有收到响应
             this.message = 'Error: No response from server';
            } else {
              // 其他错误
              this.message = `Error: ${error.message}`;
            }
        });
      },
    },
  };
  </script>
  
  <style>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .register-box {
    width: 300px;
    padding: 20px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  