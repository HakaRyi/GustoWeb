import React from 'react'

//Components:
import loginPage from '~/pages/LoginPage/loginPage';
import RegisterPage from '~/pages/registerPage';
import MainLayout from '~/layouts/MainLayout';
import Home from '~/pages/Home';
import routes from '~/config/route';
import AdminPage from '~/pages/AdminPage/AdminPage';
import { Navigate } from 'react-router-dom';


const publicRoutes = [
    { path: '/', component: () => <Navigate to="/admin" replace /> },

    {
        path: routes.home, component: MainLayout,
        children: [{
            index: true, component: Home
        }] //Toàn bộ con đi từ Home mà có Header với Footer đều nằm trong này nhan
    },
    { path: routes.login, component: loginPage },
    { path: routes.register, component: RegisterPage },
    { path: '/admin', component: AdminPage },
];

const privateRoutes = [
    { path: '/admin', component: AdminPage, role: 'Admin' },
];

export { publicRoutes, privateRoutes };