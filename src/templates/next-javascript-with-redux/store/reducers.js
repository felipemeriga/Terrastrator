import {combineReducers} from "redux";
import {tick} from "./tick/reducers";

export const reducers = combineReducers(
    {
        tick: tick
    }
);
