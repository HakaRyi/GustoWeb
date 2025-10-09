import React from 'react'

//Components:
import loginPage from '~/pages/LoginPage/loginPage';
import RegisterPage from '~/pages/registerPage';
import MainLayout from '~/layouts/MainLayout';
import Home from '~/pages/Home';
import routes from '~/config/route';
import ProfileLayout from '~/layouts/ProfileLayout';
import ProfilePage from '~/pages/ProfilePage';

const publicRoutes = [
    {path: routes.home, component: MainLayout,
        children:[{
        index: true, component: Home
    }] //Toàn bộ con đi từ Home mà có Header với Footer đều nằm trong này nhan
},
    {path: routes.login, component: loginPage},
    {path: routes.register, component: RegisterPage},
    {path: routes.profile, component: ProfileLayout,
        children: [{
            index: true,
            path: '@:username',
            component: ProfilePage
        }]
    }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };