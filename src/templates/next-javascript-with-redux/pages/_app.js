import '../styles/globals.css'
import React from 'react';
import App from 'next/app';
import wrapper from '../store/index';

class MyApp extends App {
  static getInitialProps = async ({Component, ctx}) => {
    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
        // Some custom thing for all pages
        pathname: ctx.pathname,
      },
    };

  };

  render() {
    const {Component, pageProps} = this.props;

    return (
        <Component {...pageProps} />
    );
  }
}

export default wrapper.withRedux(MyApp);
