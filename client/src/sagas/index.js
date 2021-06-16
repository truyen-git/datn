import { takeLatest, call } from "redux-saga/effects";
import { requestListUser,
    responseListUser,
    errorListUser,
    REQUEST_LIST_USER,
    RESPONSE_LIST_USER,
    ERROR_LIST_USER, } from "../actions";
import { getListUserApi } from "../api/admin";

const urlGetListUser = "/admin/users";

function* requestListUserSagas(action){
    const listUser = yield call(getListUserApi, urlGetListUser);
    console.log(listUser);
}

function* mySaga(){
    yield takeLatest(REQUEST_LIST_USER, requestListUserSagas);
};

export default mySaga;