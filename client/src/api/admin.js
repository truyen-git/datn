import axios from 'axios';

const URL = "localhost:3000/api";

async function getListUserApi(url){
    try{
        const response = await axios.get(`${URL}/${url}`);
        console.log(response);
    } catch (err) {
        console.log(err);
    }
}

export {
    getListUserApi,
}