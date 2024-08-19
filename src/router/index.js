import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/UserLogin.vue';
import Register from '@/components/UserRegister.vue';
import DashBoard from '@/components/DashBoard.vue'
import UserManagement from '@/components/UserManagement.vue';
import UserProfile from '@/components/UserProfile.vue';

Vue.use(Router);

export default new Router({

    mode: 'history', // 使用 HTML5 History 模式
    routes: [{
            path: '/',
            name: 'Login',
            component: Login,
        },
        {
            path: '/',
            name: 'Register',
            component: Register,
        },

        {
            path: '/dashboard',
            component: DashBoard,
            children: [{
                    path: '', // 默认子路由，当访问 '/dashboard' 时，会自动导航到 '/dashboard/user-management'
                    name: 'UserManagementDefault',
                    component: UserManagement,
                },
                {
                    path: 'user-profile',
                    name: 'UserProfile',
                    component: UserProfile,
                },
            ],
        },
    ],
});