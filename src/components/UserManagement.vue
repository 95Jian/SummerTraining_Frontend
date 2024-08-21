<template>
      <div v-if="user.user_read" class="content1">
        <div class="actions">
            <input v-model="searchQuery" type="text" placeholder="搜索用户名" class="search-input" />
            <button @click="searchUsers(0)" class="actions-button">
                <img src="@/assets/search.png" alt="搜索" />
            </button>
            <button @click="refreshUsers" class="actions-button">
                <img src="@/assets/refresh.png" alt="刷新" />
            </button>
            <button @click="showRegister" class="actions-button">
                <img src="@/assets/add.png" alt="Add User" />
            </button>
        </div>
        <table class="user-table">
          <thead style="height: 20px;">
            <tr>
              <th style="width: 1px;">ID</th>
              <th style="width: 30px;">用户名</th>
              <th style="width: 20px;">电话</th>
              <th style="width: 50px;">邮箱</th>
              <th style="width: 1px;">性别</th>
              <th style="width: 50px;">地址</th>
              <th style="width: 40px;">创建时间</th>
              <th style="width: 5px;">编辑</th> 
              <th style="width: 5px;">删除</th> 
              <th style="width: 16px;">用户角色</th> 
              <th style="width: 11px;">修改角色</th> 
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
              <td>
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
              <td>
                  {{ user.role }}
              </td>
              <td>
                <button @click="showAddRoleDialog(user.id)" class="actions-button">
                  <img src="@/assets/add.png" alt="Add Role" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination" style="margin-top: 5px;">
          <button @click="previousPage" :disabled="currentPage === 0">上一页</button>
          <span>第 {{ currentPage + 1 }} 页</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages - 1">下一页</button>
          <span>共 {{ totalPages }} 页</span>
        </div>
      <register-dialog v-if="showRegisterDialog" @close="showRegisterDialog = false" @user-added="fetchUsers"/>
      <div v-if="showRoleDialog" class="dialog">
        <div class="dialog-content">
          <h3>选择角色</h3>
          <div>
            <label v-for="role in allRoles" :key="role.id">
              <input type="radio" :value="role.id" v-model="selectedRole" />
              {{ role.name }}
            </label>
          </div>
          <button @click="saveRoles">确定</button>
          <button @click="closeRoleDialog">取消</button>
        </div>
      </div>
    </div>
    <div v-else>
      <span>无权限</span>
      <span>{{ user.user_read }}</span>
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
        showRoleDialog: false,
        user: {},
        users: [], // 用于存储从数据库中获取的用户数据
        URL:'http://localhost:8080',
        showAddUserDialog: false,
        totalPages:0,
        currentPage:0,
        searchQuery: '', // 添加用于存储搜索关键词的变量
        searching:false,
        editingUserId:0,
        allRoles: [],
        selectedRole:null,
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
        this.fetchMyRoles().then(() => {
          // 在 fetchMyRoles 完成后，调用 fetchUsers 和 getRoleList
          console.log("user.write_read:", this.user.write_read);

          this.$forceUpdate(); // 强制重新渲染组件
          this.fetchUsers(); 
          this.getRoleList();
        }).catch(error => {
          console.error('Failed to fetch user roles:', error);
        });

      } else {
        // 如果没有用户信息，跳转回登录页面
        this.$router.push('/login');
      }



    },
    methods: {
      async fetchMyRoles(){
      //获取用户权限
      const myResponse = await axios.get(`${this.URL}/userRole/getRoleName/${this.user.id}`);
      if (myResponse.data.role) {
        this.user.role = myResponse.data.role;
      } else {
        this.user.role = "无"; // 如果没有权限数据，设置为空数组
      }
      console.log("user role",this.user.role)
      if(this.user.role=="无"){
        this.user.user_read=false;
      }else if(this.user.role=="游客"){
        this.user.user_read=true;
        this.user.user_write=false;
        this.user.role_read=false;
        this.user.role_write=false;

      }else if(this.user.role=="管理员"){
        this.user.user_read=true;
        this.user.user_write=false;
        this.user.role_read=true;
        this.user.role_write=false;
        
      }else if(this.user.role=="高级管理员"){
        this.user.user_read=true;
        this.user.user_write=true;
        this.user.role_read=true;
        this.user.role_write=false;

      }else if(this.user.role=="超级管理员"){
        this.user.user_read=true;
        this.user.user_write=true;
        this.user.role_read=true;
        this.user.role_write=true;

      }
      console.log(this.user);
      },
      async getRoleList(){
        await axios.get(`${this.URL}/role/getAll`).then(response => {
          this.allRoles = response.data.roles;      
        }).catch(error => {
          console.error('Failed to fetch users:', error);
        });
      },
      async fetchUsers() {
        this.searchQuery="";
        this.searching=false;
        await axios.get(`${this.URL}/user/getAll`,{
          params: {
            page: this.currentPage,
            size: 10
          }
        }).then(async response => {
          this.users = response.data.users.map(user => ({ ...user, editing: false,role:"无" }));
          this.totalPages=response.data.totalPages;
          this.currentPage=response.data.currentPage;
          for (let user of this.users) {
            try {
              const response1 = await  axios.get(`${this.URL}/userRole/getRoleName/${user.id}`);
              if (response1.data.role) {
                user.role = response1.data.role;
              } else {
                user.roles = "无"; // 如果没有权限数据，设置为空数组
                }
            } catch (error) {
              console.error(`Failed to fetch roles for user ${user.id}:`, error);
              user.role = '无'; // 如果获取权限失败，设置为空数组
            }
          }
        }).catch(error => {
          console.error('Failed to fetch users:', error);
        });
      },
      refreshUsers(){
        this.searching=false;
        this.currentPage=0;
        this.fetchUsers();
      },
      searchUsers(current) {
        this.searching=true;
        this.currentPage=current;
        axios.get(`${this.URL}/user/search`, {
          params: {
            username: this.searchQuery,
            page: this.currentPage,
            size: 10
          }
        }).then(response => {
          this.users = response.data.users.map(user => ({ ...user, editing: false }));
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        }).catch(error => {
        console.error('Failed to search users:', error);
        });
      },
      previousPage() {
        if (this.currentPage > 0) {
          this.currentPage--;
          if(this.searching){
            this.searchUsers(this.currentPage);
          }else{
            this.fetchUsers();
          }
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages - 1) {
          this.currentPage++;
          if(this.searching){
            this.searchUsers(this.currentPage);
          }else{
            this.fetchUsers();
          }
       }
     },
      deleteUser(userId) {

        // 检查是否有删除权限
        if (!this.user.user_write) {
          alert('您没有权限执行此操作');
          return; // 退出方法，不执行删除操作
        }
        axios.delete(`${this.URL}/user/delete/${userId}`).then(response => {
          if (response.data.success) {
            
            if(this.searching){
                this.searchUsers(this.currentPage);
            }else{
                this.fetchUsers();
            }
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
        if (!this.user.user_write) {
          alert('您没有权限执行此操作');
          return; // 退出方法，不执行删除操作
        }
        this.showRegisterDialog = true;
      },
      editUser(user) {
                // 检查是否有删除权限
        if (!this.user.user_write) {
          alert('您没有权限执行此操作');
          return; // 退出方法，不执行删除操作
        }
        this.users.forEach(u => {
          if (u.id === user.id) {
            u.editing = true;
          }
        });
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
    showAddRoleDialog(userId) {
              // 检查是否有删除权限
      if (!this.user.user_write) {
        alert('您没有权限执行此操作');
        return; // 退出方法，不执行删除操作
      }
      this.editingUserId=userId;
      this.selectedRoles = []; // 清空之前选择的权限
      this.showRoleDialog = true;
    },
    closeRoleDialog() {
      this.showRoleDialog = false;
    },
    saveRoles() {
      axios.post(`${this.URL}/userRole/update/${this.editingUserId}`, this.selectedRole, 
        {
        headers: {
        'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.data.success) {
          alert('角色已保存');
          this.fetchUsers();
          this.closeRoleDialog();
        } else {
          alert('保存权限失败1');
        }
      }).catch(error => {
        console.error('Failed to save roles:', error);
        alert('保存权限失败2');
      });
    },
    }
  };
  </script>
  
  <style>
  .pagination{

  }
  .content1 {
    flex-grow: 1;
    background-color: #5ce668;
    overflow-y: auto;
    padding: 5px;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
  }
  
  .add-button {
    align-items: center;
    cursor: pointer;
    width: 100%;
  }
  
  .actions-column {
    display: flex;
    justify-content: center; 
    align-items: center; 
  }
  
  .actions-button img {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  
  .actions-button:hover {
    background-color: #f50e0e;
  }
  
  
  .user-info {
    text-align: center;
    margin-bottom: 20px;
  }
  
  
  .user-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  .user-table th,
  .user-table td {
    border: 1px solid #000000;
    padding: 7px;
    text-align: center;
    overflow: hidden; 
  }
  
  .table-input {
    width: 100%;
    box-sizing: border-box; 
  }
  .dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  }
.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>
  