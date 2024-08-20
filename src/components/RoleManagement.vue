<template>
    <div class="content1">
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
            <th style="width: 300px;">角色简介</th>
            <th style="width: 100px;">创建时间</th>
            <th style="width: 10px;">编辑</th> 
            <th style="width: 10px;">删除</th> 
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
            <td class="actions-column">
              <button v-if="role.editing" @click="saveRole(role)" class="actions-button">
                <img src="@/assets/save.png" alt="Save" />
              </button>
              <button v-else @click="editRole(role)" class="actions-button">
                <img src="@/assets/edit.png" alt="Edit" />
              </button>
            </td>
            <td>
              <button @click="deleteRole(role.id)" class="actions-button">
                <img src="@/assets/delete.png" alt="Delete" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    <register-dialog v-if="showRegisterDialog" @close="showRegisterDialog = false" @role-added="fetchRoles"/>
  </div>
</template>
<script>

import axios from 'axios';
import RegisterDialog from './RoleRegister.vue';

export default {
  components: { RegisterDialog },
  data() {
    return {
      showRegisterDialog: false,
      roles: [], // 用于存储从数据库中获取的用户数据
      URL:'http://localhost:8080',
      showAddRoleDialog: false,
    };
  },
  computed: {
  },
  created() {
      this.fetchRoles(); 
  },
  methods: {
    fetchRoles() {
      axios.get(`${this.URL}/role/getAll`).then(response => {
        this.roles = response.data.roles.map(role => ({ ...role, editing: false }));
        console.log(this.roles);
      }).catch(error => {
        console.error('Failed to fetch roles:', error);
      });
    },
    deleteRole(roleId) {
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
        this.showRegisterDialog = true;
    },
    editRole(role) {
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
</style>
