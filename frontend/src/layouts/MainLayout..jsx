import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footern from "../components/Footern";
import ChatBot from "../components/ChatBox";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footern />
      <ChatBot />
    </>
  );
};

export default MainLayout;
