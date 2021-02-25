import Link from 'next/link'
import Layout from '../components/Layout'
import * as React from "react";

export default class AboutPage extends React.Component {

    render() {
        return (
            <Layout title="About | Next.js + TypeScript Example">
                <h1>About</h1>
                <p>This is the about page</p>
                <p>
                    <Link href="/">
                        <a>Go home</a>
                    </Link>
                </p>
            </Layout>
        );
    }
}
