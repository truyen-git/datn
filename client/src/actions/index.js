const REQUEST_LIST_USER = "REQUEST_LIST_USER";
const requestListUser = (data) => {
  return {
    type: REQUEST_LIST_USER,
    payload: data,
  };
};

const RESPONSE_LIST_USER = "RESPONSE_LIST_USER";
const responseListUser = (data) => {
  return {
    type: RESPONSE_LIST_USER,
    payload: data,
  };
};

const ERROR_LIST_USER = "ERROR_LIST_USER";
const errorListUser = (error) => {
  return {
    type: ERROR_LIST_USER,
    payload: error,
  };
};

export {
  requestListUser,
  responseListUser,
  errorListUser,
  REQUEST_LIST_USER,
  RESPONSE_LIST_USER,
  ERROR_LIST_USER,
};
