import {applyMiddleware, createStore} from "redux";
import {reducers} from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";
import {createWrapper} from "next-redux-wrapper";
import thunk from "redux-thunk";
import {updateTick} from "./tick/actions";

// Instantiating ThunkMiddleware object with the StoreState interface and AnyAction from Redux
const thunkMiddleware = thunk.withExtraArgument({});

// This is an example Thunk async function, to modify the state as a pragmatical example
export const thunkAsyncFunction =  () => {
    return async (dispatch, getState) => {
        // @ts-ignore
        // If you want to interact with the state, you can do it using getState();
        const state = getState();
        dispatch(updateTick('updating from thunk...'))
    }
};

// create a makeStore function
// This makeStore is needed for the wrapper, for every new page that is called, a new store with the current values will be created
const makeStore = (context) => createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));

// export an assembled wrapper
// this wrapper will be used to every page's component, for injecting the store and actions into it.
const wrapper = createWrapper(makeStore, {debug: false});

export default wrapper;
