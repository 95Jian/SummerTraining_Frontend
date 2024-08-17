import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/UserLogin.vue';
import Register from '@/components/UserRegister.vue';
import DashBoard from '@/components/DashBoard.vue'

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
        },
    ],
});