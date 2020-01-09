export default class BaseAPI {

    baseURL: string = "localhost";
    
    constructor() {
        
    }

    sendRequest = (url: string, method: string = "GET", body?: any) : Promise<Response> => {
        return fetch(this.baseURL + url[0] != "/" ? "/" : "" + url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(body)
        })
        .then((response) => {
            return response
        })
        .catch((error) => {
            throw error
        })
    }
}