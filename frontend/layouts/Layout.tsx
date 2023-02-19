import React, { Component } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = (props) => {

    const router = useRouter();

    const logout = async () => {
        await fetch('http://localhost:8000/api/auth/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });
        await router.push('/login');
    };

    let navLinks;

    if (!props.auth) {
        navLinks = (
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
        );
    } else {
        navLinks = (
            <div>
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item">
                        <Link className="nav-link" href={""} onClick={logout}>
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" href={"/"}>
                    Home
                </Link>
                {navLinks}
            </div>
        </nav>

        <main className="form-signin w-100 m-auto">
            {props.children}
        </main>
      </>
    );
};

export default Layout;