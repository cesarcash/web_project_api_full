import { ApiConfigHeaders, API_URL } from "./constants";
import { getToken } from "./token";


class Api {

    constructor({headers,url}){
        this._headers = headers;
        this._url = url;
    }

    async _makeRequest(endpoint,method = 'GET', body = null){

        const options = {
            method,
            headers: {...this._headers}
        }

        if(body){
            options.body = JSON.stringify(body);
        }

        const token = getToken();
        if(token){
            options.headers['authorization'] = `Bearer ${token}`;
        }

        try {
            
            const res = await fetch(`${this._url}${endpoint}`, options);
            if(!res.ok) {
                const error = new Error(`Error ${res.status}: ${res.statusText || 'Solicitud fallida'}`);
                error.statusCode = res.status;
                throw error
            }
            return await res.json();

        }catch(error){
            console.error(`Error en signup: ${error.message}`);
            throw error;
        }

    }

    signup(data){
        return this._makeRequest('/signup','POST',data) // registro
    }

    signin(data){
        return this._makeRequest('/signin','POST',data) // login
    }

    getUserInfo(){
        return this._makeRequest('/users/me',)
    }

}

const auth = new Api({
    headers: {
        ...ApiConfigHeaders,
    },
    url: API_URL
})

export default auth;