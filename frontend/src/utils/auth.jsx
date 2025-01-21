import { AuthConfigHeaders, BASE_URL } from "./constants";

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
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
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
        accept: AuthConfigHeaders.accept,
        type: AuthConfigHeaders.type,
        authorization: AuthConfigHeaders.token
    },
    url: BASE_URL
})

export default auth;