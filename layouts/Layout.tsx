import React, { Component } from 'react';
import Head from 'next/head'
import Link from 'next/link';

const Layout = ({children}) => {
    return (
        <>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" href={"/"}>
                    Home
                </Link>
                <div>
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                            <Link className="nav-link" href={"/login"}>
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={"/register"}>
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <main className="form-signin w-100 m-auto">
            {children}
        </main>
      </>
    );
};

export default Layout;