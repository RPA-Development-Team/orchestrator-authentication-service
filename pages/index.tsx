import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/layouts/Layout';
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout>
      Home
    </Layout>
  );
}
