import Head from 'next/head';
import { ReactElement } from 'react';

export default function Home(): ReactElement {
  return (
    <div>
      <Head>
        <title>Card Game Poke API</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-12 mx-14">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to the amazing Card Game Poke API
        </h1>
      </div>
    </div>
  );
}
