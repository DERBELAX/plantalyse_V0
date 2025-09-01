import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="bg-[#f5f3eb] min-h-screen p-5 pt-[100px]">

        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
