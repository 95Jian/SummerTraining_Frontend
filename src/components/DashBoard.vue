<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <div class="user-info">
        <img :src="avatar" alt="Avatar" class="avatar"/>
        <p>{{ user.username }}</p>
      </div>
      <ul class="nav">
        <li :class="{ active: isActive('/userManagement') }">
          <router-link to="/dashboard">用户管理</router-link>
        </li>
        <li :class="{ active: isActive('/user-profile') }">
          <router-link to="/dashboard/user-profile">个人信息</router-link>
        </li>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      showRegisterDialog: false,
      user: {},
      users: [], // 用于存储从数据库中获取的用户数据
      URL:'http://localhost:8080',
      showAddUserDialog: false,
      totalPages:0,
      currentPage:0,
    };
  },
  computed: {
    avatar() {
      var avatarUrl=this.user.avatarPath;
      // 检查用户头像路径，如果为空则使用默认头像
      return this.user.avatarPath ? require(avatarUrl) : require('@/assets/defaultAvatar.png');
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

    isActive(path) {
      return this.$route.path === path;
    },
  }
};
</script>

<style>
.dashboard-container {
  display: flex;
  height: 95vh;
  overflow: hidden;
}

.sidebar {
  width: 20%;
  background-color: #ffffff;
  color: #e50b0b;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.content {
  width: 100%;
  background-color: #5ce668;
  overflow-y: auto;
  padding: 5px;
}

.user-info {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border: 2px solid rgb(6, 0, 12);
}

.nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 10%;
  flex-grow: 1;
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


</style>
