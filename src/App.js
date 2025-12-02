import { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ✅ Đã thêm Navigate
import FoodChatBot from './components/ChatBox/FoodChatBox';
import { publicRoutes, privateRoutes } from '~/routes'; 

function App() {
    const isAdmin = localStorage.getItem("role") === "Admin";

    return (
        <Router>
            <div className="App">
                <FoodChatBot />
                <Routes>
                    {/* 1. PUBLIC ROUTES */}
                    {publicRoutes.map((route, index) => {
                        let Layout = Fragment; 
                        
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.component === undefined) {
                            Layout = Fragment; 
                        } else {
                            Layout = Fragment; 
                        }

                        const Page = route.component || Fragment;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Page />
                                }
                            >
                                {route.children && route.children.map((child, i) => {
                                    const ChildPage = child.component;
                                    return (
                                        <Route 
                                            key={i} 
                                            path={child.path} 
                                            index={child.index} 
                                            element={<ChildPage />} 
                                        />
                                    );
                                })}
                            </Route>
                        );
                    })}

                    {/* 2. PRIVATE ROUTES */}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = Fragment;

                        if (route.layout) {
                            Layout = route.layout;
                        }

                        return (
                            <Route
                                key={index + publicRoutes.length}
                                path={route.path}
                                element={
                                    isAdmin ? (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    ) : (
                                        <Navigate to="/login" replace /> 
                                    )
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;