import React from 'react'

//Components:
import loginPage from '~/pages/LoginPage/loginPage';
import RegisterPage from '~/pages/registerPage';
import MainLayout from '~/layouts/MainLayout';
import Home from '~/pages/Home';
import About from '~/pages/About';
import routes from '~/config/route';
import ProfileLayout from '~/layouts/ProfileLayout';
import ProfilePage from '~/pages/ProfilePage';
import TermsPage from '~/pages/TermsAndLegal';
import Restaurants from '~/pages/Restaurants';
import Contact from '~/pages/Contact';


const publicRoutes = [
    {path: routes.home, component: MainLayout,
        children:[{
        index: true, component: Home
    },{ path: routes.about, component: About },
        { path: routes.terms, component: TermsPage },
    { path: routes.contact, component: Contact },
{ path: routes.restaurants, component: Restaurants },] //Toàn bộ con đi từ Home mà có Header với Footer đều nằm trong này nhan
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