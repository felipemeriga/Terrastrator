import Link from 'next/link'
import Layout from '../components/Layout'
import * as React from "react";

export default class App extends React.Component {

  render() {
    return (
        <Layout title="Home | Next.js + TypeScript Example">
          <h1>Hello Next.js 👋</h1>
          <p>
            <Link href="/about">
              <a>About</a>
            </Link>
          </p>
        </Layout>
    );
  }
}

