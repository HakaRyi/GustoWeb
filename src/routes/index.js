// Config
import routes from '~/config/route';

// Layouts
import MainLayout from '~/layouts/MainLayout';
import ProfileLayout from '~/layouts/ProfileLayout';

// Admin Page
import AdminPage from '~/pages/AdminPage/AdminPage';

// General Pages
import Home from '~/pages/Home';
import About from '~/pages/About';
import TermsPage from '~/pages/TermsAndLegal';
import Contact from '~/pages/Contact';
import FavouritePage from '~/pages/FavouritePage';
import BookingHistory from '~/pages/BookingHistory';
import Restaurants from '~/pages/Restaurants';
import MyCart from '~/pages/myCart.js';
import LoginPage from '~/pages/LoginPage/loginPage';
import RegisterPage from '~/pages/registerPage';
import ProfilePage from '~/pages/ProfilePage';
import AccountSettingsPage from '~/pages/AccountSettingPage';

// Restaurant Pages & Components
import ProfileRestaurant from '~/pages/ProfileRestaurant';
import LayoutRestaurant from '~/components/Restaurant/LayoutRestaurant/LayoutRestaurant';
import MenuLayout from '~/components/Restaurant/Menu/MenuLayout';
import TableResLayout from '~/components/Restaurant/Table/TableResLayout';
import IntegratePaymentAccount from '~/components/Restaurant/IntegratePaymentAccount/IntegratePaymentAccount';
import RestaurantDetail from '~/components/RestaurantDetail/RestaurantDetail';
import RestaurantHomePage from '~/components/Restaurant/RestaurantHomePage';
import ProfileRestaurantLayout from '~/components/Restaurant/ProfileRestaurantLayout';
// Payment Pages
import PaymentMerchantRequest from '~/pages/PaymentMerchant';
import PreviewBeforePay from '~/pages/PreviewBeforePay/PreviewBeforePay';

const publicRoutes = [
    // 1. Main Layout (Giao diện chính cho người dùng)
    {
        path: '/',
        component: MainLayout,
        children: [
            { index: true, component: Home },
            { path: routes.about, component: About },
            { path: routes.terms, component: TermsPage },
            { path: routes.contact, component: Contact },
            { path: routes.restaurants, component: Restaurants },
            { path: routes.restaurantDetail, component: RestaurantDetail },
            { path: routes.previewBeforePay, component: PreviewBeforePay },
            { path: routes.myCart, component: MyCart },
        ],
    },

    // 2. Auth Pages
    { path: routes.login, component: LoginPage },
    { path: routes.register, component: RegisterPage },

    // 3. User Profile Layout
    {
        path: routes.profile,
        component: ProfileLayout,
        children: [
            { index: true, component: ProfilePage },
            { path: routes.bookingHistory, component: BookingHistory },
            { path: routes.favourite, component: FavouritePage },
            { path: routes.setting, component: AccountSettingsPage },
        ],
    },

    // 4. Restaurant Management Layout (Dành cho chủ nhà hàng)
    {
        path: routes.resProfile,
        component: ProfileRestaurant,
        children: [
            { index: true, component: RestaurantHomePage },
            { path: routes.restaurantHome, component: ProfileRestaurantLayout },

            { path: 'layout', component: LayoutRestaurant },
            { path: 'menu', component: MenuLayout },
            { path: 'table', component: TableResLayout },
            { path: 'integratePaymentAccount', component: IntegratePaymentAccount },
        ],
    },

    // 5. Other
    {
        path: routes.uploadBankAccount,
        component: PaymentMerchantRequest,
    },
];

// 6. Private Routes (Chỉ Admin mới vào được)
const privateRoutes = [{ path: '/admin', component: AdminPage, role: 'Admin' }];

export { publicRoutes, privateRoutes };
