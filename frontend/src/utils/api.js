import {ApiConfigHeaders, API_URL} from './constants';

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
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
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

    getInfoUser(){

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
        accept: ApiConfigHeaders.accept,
        type: ApiConfigHeaders.type,
        authorization: ApiConfigHeaders.token
    },
    url: API_URL
});

export default api;