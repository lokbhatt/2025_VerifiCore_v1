import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/frontend/NavBar";
import Footer from '../components/frontend/Footer';
const PublicLayout = () => {
  return (
    <>
      <Fragment>
        <NavBar />
        <main>
          <Outlet />
        </main>
        <Footer/>
      </Fragment>
    </>
  );
};

export default PublicLayout;
