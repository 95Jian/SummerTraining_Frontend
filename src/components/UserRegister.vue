<template>
    <div class="register-container">
      <div class="register-box">
        <h2>Register</h2>
        <div>
          <input class="register-info" v-model="username" type="text" placeholder="Username" />
          <input class="register-info" v-model="password" type="password" placeholder="Password" />
          <input class="register-info" v-model="phone" type="text" placeholder="Phone" />
          <input class="register-info" v-model="email" type="text" placeholder="Email" />
          <input class="register-info" v-model="gender" type="text" placeholder="Gender" />
          <input class="register-info" v-model="address" type="text" placeholder="Address" />
        </div>
        <div class="register-info">
          <button @click="register">Register</button>
        </div>
        <p v-if="message">{{ message }}</p>
        <button class="register-info" @click="$emit('close')">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        username: '',
        password: '',
        email: '',
        phone:'',
        gender:'',
        message: '',
        URL:'http://localhost:8080',
      };
    },
    methods: {
      register() {
        axios.post(`${this.URL}/user/register`, {
          username: this.username,
          password: this.password,
          phone:this.phone,
          email:this.email,
          gender:this.gender,
        }).then(response => {
          if (response.data.success) {
            this.message = '注册成功！';
            this.$emit('user-added'); // 发出事件通知父组件
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

  .register-info{
    margin-top: 5px;
  }
  </style>
  