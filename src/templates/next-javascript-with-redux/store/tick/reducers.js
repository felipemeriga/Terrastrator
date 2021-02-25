import {HYDRATE} from "next-redux-wrapper";


const initialState = {
    message: 'init'
};

export function tick(state = initialState, action) {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return {...state};
        case 'TICK':
            return {...state, message: action.payload};
        default:
            return state;
    }
}
