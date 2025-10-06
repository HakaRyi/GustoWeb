import React from 'react'

//Components:
import loginPage from '~/pages/LoginPage/loginPage';
import RegisterPage from '~/pages/registerPage';
import routes from '~/config/route';

const publicRoutes = [
    {path: routes.login, component: loginPage},
    {path: routes.register, component: RegisterPage},
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };