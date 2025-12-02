const routes = {
    home: '/home',
    login: '/login',
    register: '/register',

    profile: '/profile',
    bookingHistory: 'bkh',
    favourite: 'favourites',
    setting: 'settings',

    uploadBankAccount: '/upload-bank-account',

    about: '/about',
    terms: '/terms',
    contact: '/contact',
    restaurants: '/restaurants',
    restaurantDetail: '/restaurants/:slug',

    myCart: '/myCart',

    resProfile: '/profileRestaurant',
    resProfileLayout: '/profileRestaurant', // Route cho trang hồ sơ
    restaurantHome: 'home',
    reslayout: 'layout', // Relative path
    resmenu: 'menu',
    restable: 'table',
    resPayAcc: 'integratePaymentAccount',
    previewBeforePay: '/preview-before-pay',
};

export default routes;
