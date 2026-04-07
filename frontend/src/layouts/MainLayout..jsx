import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footern from "../components/Footern";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footern />
    </>
  );
};

export default MainLayout;
