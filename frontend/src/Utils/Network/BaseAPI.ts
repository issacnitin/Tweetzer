export default class BaseAPI {

    baseURL: string = "http://127.0.0.1";
    
    constructor(port?: string) {
        if(!!port) {
            this.baseURL += ":" + port;
        }
    }

    sendRequest = (url: string, method: string = "GET", body?: any) : Promise<Response> => {
        console.log(this.baseURL)
        console.log(url)
        console.log(method)
        return fetch(this.baseURL + (url[0] != "/" ? "/" : "") + url, {
            method: method,
            mode: 'no-cors',
            headers: {
                'Accept': 'application/json, text',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(body)
        })
        .then((response) => {
            console.log(response)
            return response
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
    }
}