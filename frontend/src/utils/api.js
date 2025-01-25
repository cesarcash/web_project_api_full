import { ApiConfigHeaders, API_URL } from './constants';
import { getToken } from "./token";

class Api {

    constructor({headers,url}){
        this._headers = headers;
        this._url = url;
    }

    async _makeRequest(endpoint, method = 'GET', body = null){

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

            const res = await fetch(`${this._url}${endpoint}`,options);
            if(!res.ok) throw new Error(`Server error: ${res.status}`);
            return await res.json();

        }catch(error){
            console.error(`Server error: ${error}`);
            throw error;
        }

    }

    getInitialCards(){

        return this._makeRequest('/cards');

    }

    getUserInfo(){

        return this._makeRequest('/users/me')
        
    }

    setUserInfo({name,about}){        

        return this._makeRequest('/users/me','PATCH',{name,about})

    }

    setNewCard({name, link}){

        return this._makeRequest('/cards','POST',{name,link});

    }

    deleteCard(idCard){

        return this._makeRequest(`/cards/${idCard}`,'DELETE');

    }

    changeLikeCardStatus(idCard,isLiked){

        const method = (isLiked) ? 'PUT' : 'DELETE';
        return this._makeRequest(`/cards/likes/${idCard}`,method)

    }

    editImgUser({avatar}){

        return this._makeRequest('/users/me/avatar','PATCH',{avatar})

    }    

}

const api = new Api({
    headers: {
        ...ApiConfigHeaders,
    },
    url: API_URL
});

export default api;