import Layout from '@/layouts/Layout';
import Head from 'next/head';
import React from 'react';

const Login = () => {
    return (
        <div>
            <Head>
                <title>Login</title>
            </Head>
            <Layout>
                <form>
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating">
                        <input type="text" className="form-control" id="floatingInput" placeholder="username" required/>
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required/>
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                </form>
            </Layout>
        </div>
    );
};

export default Login;