import BaseAPI from "./BaseAPI";

class AuthenticationAPI extends BaseAPI {
    constructor() {
        super("8080")
    }

    async signIn(username: string, password: string) {
        let response = await this.sendRequest("/api/v1/profile/login", "POST", { "username": username, "password": password})
        let responseJSON = await response.json();
        return {
            body: responseJSON.body,
            statusCode: responseJSON.status
        }
    }

    async signUp(username: string, password: string) {
        let response = await this.sendRequest("/api/v1/profile/register", "POST", { "username": username, "password": password})
        let responseJSON = await response.json();
        return {
            body: responseJSON.body,
            statusCode: responseJSON.status
        }
    }

    async refreshToken() {
        let response = await this.sendRequest("/api/v1/profile/refreshtoken", "GET")
        let responseJSON = await response.json();
        return {
            body: responseJSON.body,
            statusCode: responseJSON.status
        }
    }
}

export default AuthenticationAPI;