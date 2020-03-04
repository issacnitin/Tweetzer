import BaseAPI from "./BaseAPI";

class AuthenticationAPI extends BaseAPI {
    constructor() {
        super()
    }

    async signIn(username: string, password: string) {
        let response = await this.sendRequest("/api/v1/profile/login", "POST", { "username": username, "password": password})
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }

    async signUp(name: string, username: string, email: string, password: string) {
        let response = await this.sendRequest("/api/v1/profile/register", "POST", { "name": name, "username": username, "email": email, "password": password})
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }

    async refreshToken() {
        let response = await this.sendRequest("/api/v1/profile/refreshtoken", "GET")
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }
}

export default AuthenticationAPI;