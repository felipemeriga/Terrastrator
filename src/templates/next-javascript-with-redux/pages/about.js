import Link from 'next/link'
import Layout from '../components/Layout'
import * as React from "react";
import {connect} from "react-redux";
import {getTickState} from "../store/selectors";
import wrapper from "../store";

class AboutPage extends React.Component {

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
                <div>
                    The current tick state: {this.props.tick.message}
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
        tick: getTickState(state),
    }
);

export default connect(mapStateToProps, null)(AboutPage)

// As the wrapper is injected in _app.tsx, for every component(page) that will interact with Redux and Thunk
// you need to place this piece of code bellow, that will get the static props from the wrapper, and inject on your
// component
export const getStaticProps = wrapper.getStaticProps(
    ({}) => {
    }
);
