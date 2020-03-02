import { store } from "../../Utils/Redux/ConfigureStore";

export default class BaseAPI {

    baseURL: string = "http://tweetzer.com";
    
    constructor(port?: string) {
        if(!!port) {
            this.baseURL += ":" + port;
        }
    }

    sendRequest = (url: string, method: string = "GET", body?: any) : Promise<any> => {
        console.log(this.baseURL)
        console.log(url)
        console.log(method)
        return fetch(this.baseURL + (url[0] != "/" ? "/" : "") + url, {
            method: method,
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(body)
        })
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
    }

    sendRequestAuthorized = (url: string, method: string = "GET", body?: any) : Promise<any> => {
        let authToken = store.getState().Authentication.authToken;
        console.log(authToken)
        return fetch(this.baseURL + (url[0] != "/" ? "/" : "") + url, {
            method: method,
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken 
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(body)
        })
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
    }
}