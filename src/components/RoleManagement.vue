<template>
    <div v-if="user.role_read" class="content1">
      <div class="actions">
          <button @click="showRegister" class="actions-button">
              <img src="@/assets/add.png" alt="Add Role" />
          </button>
      </div>
      <table class="role-table">
        <thead style="height: 20px;">
          <tr>
            <th style="width: 1px;">ID</th>
            <th style="width: 30px;">角色名</th>
            <th style="width: 80px;">角色简介</th>
            <th style="width: 50px;">创建时间</th>
            <th style="width: 20px;">编辑</th> 
            <th style="width: 100px;">角色权限</th> 
            <th style="width: 20px;">修改权限</th> 
            <th style="width: 20px;">删除</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.id }}</td>
            <td>
              <input v-if="role.editing" type="text" v-model="role.name" class="table-input" />
              <span v-else>{{ role.name }}</span>
            </td>
            <td>
              <input v-if="role.editing" type="text" v-model="role.description" class="table-input" />
              <span v-else>{{ role.description }}</span>
            </td>
            <td>{{ role.createTime }}</td>
            <td>
              <button v-if="role.editing" @click="saveRole(role)" class="actions-button">
                <img src="@/assets/save.png" alt="Save" />
              </button>
              <button v-else @click="editRole(role)" class="actions-button">
                <img src="@/assets/edit.png" alt="Edit" />
              </button>
            </td>
            <td>
              {{ role.permissions.join(', ')  }}
            </td>
            <td>
              <button @click="showAddPermissionDialog(role.id)" class="actions-button">
                <img src="@/assets/add.png" alt="Add Role" />
              </button>
            </td>
            <td>
              <button @click="deleteRole(role.id)" class="actions-button">
                <img src="@/assets/delete.png" alt="Delete" />
              </button>
            </td>
          </tr>
        </tbody>
      </table><!-- 弹出框 -->
      
      <role-register-dialog v-if="showRegisterDialog" @close="showRegisterDialog = false" @role-added="fetchRoles"/>
    <div v-if="showPermissionDialog" class="dialog">
      <div class="dialog-content">
        <h3>选择权限</h3>
        <div>
          <label v-for="permission in allPermissions" :key="permission.id">
            <input type="checkbox" :value="permission.id" v-model="selectedPermissions" />
            {{ permission.name }}
          </label>
        </div>
        <button @click="savePermissions">确定</button>
        <button @click="closePermissionDialog">取消</button>
      </div>
    </div>
  </div>
  <div v-else>
    无权限
  </div>
</template>
<script>

import axios from 'axios';
import RoleRegisterDialog from './RoleRegister.vue';

export default {
  components: { RoleRegisterDialog },
  data() {
    return {
      user:{},
      showPermissionDialog: false,
      showRegisterDialog:false,
      roles: [], // 用于存储从数据库中获取的用户数据
      URL:'http://localhost:8080',
      editingRoleId:0,
      allPermissions: [
        { id: 1, name: '读取用户' },
        { id: 2, name: '修改用户' },
        { id: 3, name: '读取角色' },
        { id: 4, name: '修改角色' },
      ],
      selectedPermissions:[],
    };
  },
  computed: {
  },
  created() {
    const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        this.fetchMyRoles().then(() => {
          // 在 fetchMyRoles 完成后，调用 fetchUsers 和 getRoleList
          console.log("User permissions:", this.user.role_read);

          this.$forceUpdate(); // 强制重新渲染组件
          this.fetchRoles(); 
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
      if(this.user.role=="无"){
        this.user.user_read=false;
      }else if(this.user.role=="游客"){
        this.user.user_read=true;
        this.user.user_write=false;
        this.user.role_read=false;

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

      }else{
        this.user.user_read=true;
        this.user.user_write=true;
        this.user.role_read=true;
        this.user.role_write=true;

      }
      console.log(this.user);
    },
    async fetchRoles() {
      await axios.get(`${this.URL}/role/getAll`).then(async response => {
        this.roles = response.data.roles.map(role => ({ ...role, editing: false, permissions: []  }));
        // 获取每个角色的权限
        for (let role of this.roles) {
          try {
            const permissionsResponse = await  axios.get(`${this.URL}/permission/getPermissionName/${role.id}`);
            if (permissionsResponse.data.permissions) {
              role.permissions = permissionsResponse.data.permissions;
            } else {
              role.permissions = ["无"]; // 如果没有权限数据，设置为空数组
            }
          } catch (error) {
            console.error(`Failed to fetch permissions for role ${role.id}:`, error);
            role.permissions = ['无']; // 如果获取权限失败，设置为空数组
          }
        }
        
      }).catch(error => {
        console.error('Failed to fetch roles:', error);
      });
    },
    deleteRole(roleId) {
      if (!this.user.role_write) {
          alert('您没有权限执行此操作');
          return; // 退出方法，不执行删除操作
        }
      axios.delete(`${this.URL}/role/delete/${roleId}`).then(response => {
        if (response.data.success) {
          
          this.fetchRoles();
          alert('删除成功');
        }else {
          alert('删角色失败');
        }
      }).catch(error => {
        console.error('Failed to delete role:', error);
        alert('删除角色失败');
      });
    },
    showRegister() {
      if (!this.user.role_write) {
          alert('您没有权限执行此操作');
          return; // 退出方法，不执行删除操作
        }
        this.showRegisterDialog = true;
    },
    editRole(role) {
      if (!this.user.role_write) {
          alert('您没有权限执行此操作');
          return; // 退出方法，不执行删除操作
        }
      this.roles.forEach(u => {
        if (u.id === role.id) {
          u.editing = true;
        }
      });
      console.log(role);
    },
    saveRole(role) {
      axios.put(`${this.URL}/role/update/${role.id}`, {
        name: role.name,
        description: role.description,
      }).then(response => {
        if (response.data.success) {
          this.fetchRoles();
        } else {
          alert(response.data.message);
        }
      }).catch(error => {
        console.error('Failed to save roles:', error);
        alert('保存角色信息失败');
      });
    },
    showAddPermissionDialog(roleId) {
      if (!this.user.role_write) {
          alert('您没有权限执行此操作');
          return; // 退出方法，不执行删除操作
        }
      this.editingRoleId=roleId;
      this.selectedPermissions = []; // 清空之前选择的权限
      this.showPermissionDialog = true;
    },
    closePermissionDialog() {
      this.showPermissionDialog = false;
    },
    savePermissions() {
      axios.post(`${this.URL}/permission/update/${this.editingRoleId}`, this.selectedPermissions
      ).then(response => {
        if (response.data.success) {
          alert('权限已保存');
          this.fetchRoles();
          this.closePermissionDialog();
          console.log(this.roles);
        } else {
          alert('保存权限失败1');
        }
      }).catch(error => {
        console.error('Failed to save permissions:', error);
        alert('保存权限失败2');
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


.role-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.role-table th,
.role-table td {
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
