import React from 'react'
import { Outlet } from 'react-router-dom';

//Components:
import Header from '~/components/GlobalStyle/Header'
import Footer from '~/components/GlobalStyle/Footer'

function MainLayout() {
  return (
    <div className="app-container">
        <Header />
        <main className="main-content">
            <Outlet />
        </main>
        <Footer />  
    </div>
  )
}

export default MainLayout
