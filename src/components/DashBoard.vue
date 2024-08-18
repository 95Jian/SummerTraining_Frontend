<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <div class="user-info">
        <img :src="avatar" alt="Avatar" class="avatar"/>
        <p>{{ user.username }}</p>
      </div>
      <ul class="nav">
        <li @click="navigate('user-management')">用户管理</li>
        <li @click="navigate('role-management')">角色管理</li>
        <li @click="navigate('permission-management')">权限管理</li>
        <li @click="navigate('personal-info')">个人信息</li>
      </ul>
    </div>
    <div class="content">
      <div class="actions">
        <button @click="showRegister" class="actions-button">
          <img src="@/assets/add.png" alt="Add User" />
        </button>
      </div>
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>电话</th>
            <th>邮箱</th>
            <th>性别</th>
            <th>地址</th>
            <th>创建时间</th>
            <th>编辑</th> 
            <th>删除</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <input v-if="user.editing" type="text" v-model="user.username" class="table-input" />
              <span v-else>{{ user.username }}</span>
            </td>
            <td>
              <input v-if="user.editing" type="text" v-model="user.phone" class="table-input" />
              <span v-else>{{ user.phone }}</span>
            </td>
            <td>
              <input v-if="user.editing" type="email" v-model="user.email" class="table-input" />
              <span v-else>{{ user.email }}</span>
            </td>
            <td>
              <input v-if="user.editing" type="text" v-model="user.gender" class="table-input" />
              <span v-else>{{ user.gender }}</span>
            </td>
            <td>
              <input v-if="user.editing" type="text" v-model="user.address" class="table-input" />
              <span v-else>{{ user.address }}</span>
            </td>
            <td>{{ user.createTime }}</td>
            <td class="actions-column">
              <button v-if="user.editing" @click="saveUser(user)" class="actions-button">
                <img src="@/assets/save.png" alt="Save" />
              </button>
              <button v-else @click="editUser(user)" class="actions-button">
                <img src="@/assets/edit.png" alt="Edit" />
              </button>
            </td>
            <td>
              <button @click="deleteUser(user.id)" class="actions-button">
                <img src="@/assets/delete.png" alt="Delete" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <register-dialog v-if="showRegisterDialog" @close="showRegisterDialog = false" @user-added="fetchUsers"/>
  </div>
</template>
<script>

import axios from 'axios';
import RegisterDialog from './UserRegister.vue';

export default {
  components: { RegisterDialog },
  data() {
    return {
      showRegisterDialog: false,
      user: {},
      users: [], // 用于存储从数据库中获取的用户数据
      URL:'http://localhost:8080',
      showAddUserDialog: false,
    };
  },
  computed: {
    avatar() {
      // 检查用户头像路径，如果为空则使用默认头像
      return this.user.avatar_path ? this.user.avatar_path : require('@/assets/defaultAvatar.png');
    }
  },
  created() {
    // 从 localStorage 获取用户信息
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchUsers(); // 获取所有用户数据
    } else {
      // 如果没有用户信息，跳转回登录页面
      this.$router.push('/login');
    }
  },
  methods: {
    navigate(section) {
      // 根据点击的导航项进行页面跳转或内容加载逻辑
      console.log(`Navigating to ${section}`);
    },
    fetchUsers() {
      axios.get(`${this.URL}/user/getAllUsers`).then(response => {
        this.users = response.data.map(user => ({ ...user, editing: false }));
      }).catch(error => {
        console.error('Failed to fetch users:', error);
      });
    },
    deleteUser(userId) {
      axios.delete(`${this.URL}/user/delete/${userId}`).then(response => {
        if (response.data.success) {
          this.fetchUsers();
          alert('删除成功');
        } else {
          alert('删除用户失败');
        }
      }).catch(error => {
        console.error('Failed to delete user:', error);
        alert('删除用户失败');
      });
    },
    showRegister() {
        this.showRegisterDialog = true;
    },
    editUser(user) {
      this.users.forEach(u => {
        if (u.id === user.id) {
          u.editing = true;
        }
      });
      console.log(user);
    },
    saveUser(user) {
      axios.put(`${this.URL}/user/update/${user.id}`, {
        username: user.username,
        phone: user.phone,
        email: user.email,
        gender: user.gender,
        address: user.address,
      }).then(response => {
        if (response.data.success) {
          user.editing = false;
          this.fetchUsers();
        } else {
          alert('保存用户信息失败');
        }
      }).catch(error => {
        console.error('Failed to save user:', error);
        alert('保存用户信息失败');
      });
    },
  }
};
</script>

<style>
.dashboard-container {
  display: flex;
  height: 97.5vh;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #ffffff;
  color: #e50b0b;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-button {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.actions-column {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  cursor: pointer;
}

.actions-button img {
  width: 30px;
  height: 30px;
}

.actions-button:hover {
  background-color: #f50e0e;
}


.user-info {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  border: 2px solid rgb(6, 0, 12);
}

.nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 10%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.nav li {
  padding: 10px;
  margin-top: 10px;
  text-align: center;
  cursor: pointer;
  background-color: #5ce668;
}

.nav li:hover {
  background-color: #444;
}

.content {
  flex-grow: 1;
  background-color: #5ce668;
  padding: 20px;
  overflow-y: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Ensure table layout is fixed */
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  overflow: hidden; /* Hide overflow content */
}

.table-input {
  width: 100%;
  box-sizing: border-box; /* Ensure input fits within the cell */
}
</style>
