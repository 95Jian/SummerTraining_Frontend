<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <div class="user-info">
        <img :src="avatar" alt="Avatar" class="avatar"/>
        <p>用户名：{{ user.username }}</p>
      </div>
      <ul class="nav">
        <li :class="{ active: isActive('/userManagement') }">
          <router-link to="/dashboard">用户管理</router-link>
        </li>
        <li :class="{ active: isActive('/roleManagement') }">
          <router-link to="/dashboard/role-management">角色管理</router-link>
        </li>
        <li :class="{ active: isActive('/') }">
          <router-link to="/">退出登录</router-link>
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
  height: 97vh;
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
  background-color: #ffffff;
  overflow-y: auto;
  padding: 5px;
  height: 93vh;
  border: 1px solid #000000;
  border-radius: 1%;
}


.user-info {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 0px;
  font-size: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
}

.nav {
  list-style: none;
  padding: 0;
  margin-top: 50px;
  
}

.nav li {
  width: 100%;
  display: inline-block;
  font-size: 26px; /* 修改这里设置字体大小 */
  margin-top: 20px;
  border: 1px solid #000000;
}

.nav li a {
  text-decoration: none;
  color: black;
  display: block;
  padding: 10px;
}

.nav li.active a {
  background-color: #9c06fa;
  color: white;
}

.nav li a:hover {
  background-color: #0056b3;
  color: white;
}

</style>
