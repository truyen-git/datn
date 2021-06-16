import { combineReducers } from "redux";
import adminReducers from "./admin";
import configReducers from "./config";
import uiReducers from "./ui";

export default combineReducers({
    adminReducers,
    configReducers,
    uiReducers,
})