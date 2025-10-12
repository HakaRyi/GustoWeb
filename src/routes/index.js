import React from 'react';


//Components:
import loginPage from '~/pages/LoginPage/loginPage';
import RegisterPage from '~/pages/registerPage';

import routes from '~/config/route';

import MainLayout from '~/layouts/MainLayout';
import Home from '~/pages/Home';
import About from '~/pages/About';
import TermsPage from '~/pages/TermsAndLegal';
import Contact from '~/pages/Contact';

import BookingHistory from '~/pages/BookingHistory';
import Restaurants from '~/pages/Restaurants';
import MyCart from '~/pages/myCart.js';
import LoginPage from '~/pages/LoginPage/loginPage';
import RegisterPage from '~/pages/registerPage';
import ProfileLayout from '~/layouts/ProfileLayout';
import ProfilePage from '~/pages/ProfilePage';
import ProfileRestaurant from '~/pages/ProfileRestaurant';
import ProfileRestaurantLayout from '~/components/Restaurant/ProfileRestaurantLayout';
import LayoutRestaurant from '~/components/Restaurant/LayoutRestaurant/LayoutRestaurant';
import MenuLayout from '~/components/Restaurant/Menu/MenuLayout';
import TableResLayout from '~/components/Restaurant/Table/TableResLayout';

const publicRoutes = [
  {
    path: routes.home,
    component: MainLayout,
    children: [
      { index: true, component: Home },
      { path: routes.about, component: About },
      { path: routes.terms, component: TermsPage },
      { path: routes.contact, component: Contact },
      { path: routes.restaurants, component: Restaurants },
      { path: routes.myCart, component: MyCart },
      
    ],
  },
  { path: routes.login, component: LoginPage },
  { path: routes.register, component: RegisterPage },
  {
        path: routes.profile,
        component: ProfileLayout,
        children: [
            {
                index: true,
                component: ProfilePage,
            },
            {
                path: routes.bookingHistory,
                component: BookingHistory,
            },
        ],
    },
  {
        path: routes.resProfile, // Thêm /profileRestaurant vào MainLayout
        component: ProfileRestaurant,
        children: [
          { index: true, component: ProfileRestaurantLayout },
          { path: 'layout', component: LayoutRestaurant }, // Sử dụng relative path
          { path: 'menu', component: MenuLayout },
          { path: 'table', component: TableResLayout },
        ],
      },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
