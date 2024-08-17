<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <div class="user-info">
        <img :src="avatar" alt="Avatar" class="avatar"/>
        <p>{{ user.user_name }}</p>
      </div>
      <ul class="nav">
        <li @click="navigate('user-management')">用户管理</li>
        <li @click="navigate('role-management')">角色管理</li>
        <li @click="navigate('permission-management')">权限管理</li>
        <li @click="navigate('personal-info')">个人信息</li>
      </ul>
    </div>
    <div class="content">
      <!-- 右侧内容区域 -->
      <p>右侧内容区域</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {}
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
    } else {
      // 如果没有用户信息，跳转回登录页面
      this.$router.push('/login');
    }
  },
  methods: {
    navigate(section) {
      // 根据点击的导航项进行页面跳转或内容加载逻辑
      console.log(`Navigating to ${section}`);
    }
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
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}
.user-info {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.nav li {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  flex: 1;
}

.nav li:hover {
  background-color: #444;
}

.content {
  flex-grow: 1;
  background-color: #5ce668;
  padding: 20px;
  box-sizing: border-box;
}
</style>
