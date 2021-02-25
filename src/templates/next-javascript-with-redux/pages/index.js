import Link from 'next/link'
import Layout from '../components/Layout'
import {connect} from "react-redux";
import * as React from "react";
import {getTickState} from "../store/selectors";
import wrapper, {thunkAsyncFunction} from "../store";

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentWillUnmount() {
    await this.props.thunkAsyncFunction();
  }

  render() {
    return (
        <Layout title="Home | Next.js + TypeScript Example">
          <h1>Hello Next.js 👋</h1>
          <p>
            <Link href="/about">
              <a>About</a>
            </Link>
          </p>
          <div>
            The current tick state: {this.props.tick.message}
          </div>
        </Layout>
    );
  }
}

const mapStateToProps = (state)=> ({
  tick: getTickState(state)
});

const mapDispatchToProps = (dispatch) => {
  return {
    thunkAsyncFunction: () => dispatch(thunkAsyncFunction())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// As the wrapper is injected in _app.tsx, for every component(page) that will interact with Redux and Thunk
// you need to place this piece of code bellow, that will get the static props from the wrapper, and inject on your
// component
export const getStaticProps = wrapper.getStaticProps(
    ({}) => {
    }
);
