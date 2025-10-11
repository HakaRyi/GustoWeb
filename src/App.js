import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Header from './components/GlobalStyle/Header.js';
import Footer from './components/GlobalStyle/Footer.js';
import Restaurants from './pages/Restaurants.js';
import LoginPage from './pages/LoginPage/loginPage.js';
import About from './pages/About.js';

import routes from './config/route.js';

import { publicRoutes } from '~/routes';
import { useState, useEffect } from 'react';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAdmin, setIsAdmin] = useState(false);
  return (
   <Router>
     <div className="App">
      
            <Routes>
                {publicRoutes.map((route, index) => {
                    let Layout = Fragment;// ở đây mình set default layout nè, tức là layout có sẵn Header và Footer
                    if (route.layout) {
                        Layout = route.layout; //ở đây nó kiểm tra xem cái page nào đó nó có layout riêng không, nếu có thì nó sẽ
                        //sài của của riêng nó ở đây
                    }

                    const DefaultComponent = route.children?.[0]?.component;//thằng này nó kiểm tra xem route đó có con hay không, nếu có thì nó lấy cái page đầu tiên làm mặc định nha
                    const Page = route.component;
                    //Khúc dưới hoạt động sao hỏi chat GPT nhan, giờ tui tạo Layout có Header với Footer cho Đôn, còn page con Đôn dô routes Đôn cấu hình giúp tui
                    return (
                        <Route
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                            key={index}
                        >
                            {DefaultComponent && <Route index element={<DefaultComponent />} />}
                            {route.children?.map((child, i) => {
                                const ChildPage = child.component;
                                return <Route path={child.path} element={<ChildPage />} key={i} />;
                            })}
                        </Route>
                    );
                })}
            </Routes>
        </div>
    </Router>
  );
}

export default App;
