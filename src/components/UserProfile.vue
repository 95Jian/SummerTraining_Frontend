<template>
    <div class="content1">
      
  </div>
</template>
<script>

import axios from 'axios';

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
  },
  created() {
  },
  methods: {
    fetchUsers() {
      axios.get(`${this.URL}/user/getAllUsers`,{
        params: {
          page: this.currentPage,
          size: 10
        }
      }).then(response => {
        this.users = response.data.users.map(user => ({ ...user, editing: false }));
        this.totalPages=response.data.totalPages;
        this.currentPage=response.data.currentPage;
        console.log(this.users);
      }).catch(error => {
        console.error('Failed to fetch users:', error);
      });
    },
  }
};
</script>

<style>

.content1 {
    flex-grow: 1;
    background-color: #5ce668;
    overflow-y: auto;
    padding: 5px;
  }