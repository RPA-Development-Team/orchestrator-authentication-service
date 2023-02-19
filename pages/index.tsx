import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/layouts/Layout';
import { Inter } from '@next/font/google'
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [message, setMessage] = useState('');
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    (
      async () => {
        try {
          const res = await fetch("http://localhost:8000/api/auth/user", {
            credentials: 'include'
          });
          const content = await res.json();
          if (content.success) {
            setMessage(`Hi ${content.user.username}`);
            setAuth(true);
          } else setMessage(`You are not logged in.`);
        } catch (e) {
          setMessage(`You are not logged in.`);
        }
      }
    )();
  });

  return (
    <Layout auth={auth}>
      <Head>
        <title>Home</title>
      </Head>
      {message}
    </Layout>
  );
}
