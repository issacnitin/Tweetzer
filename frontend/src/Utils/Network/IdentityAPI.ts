import BaseAPI from './BaseAPI';

export default class IdentityAPI extends BaseAPI {
    constructor() {
        super()
    }

    async getProfile(username: string) {
        let response = await this.sendRequestAuthorized("/api/v1/profile/getprofile/"+username, "GET")
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }

    async getMyProfile() {
        let response = await this.sendRequestAuthorized("/api/v1/profile/getme", "GET")
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }

    async checkUsername(username: string) {
        let response = await this.sendRequestAuthorized("/api/v1/profile/checkusername/" + username, "GET")
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }

    async searchUser(text: string, page: number) {
        let response = await this.sendRequestAuthorized("/api/v1/profile/search/" + text + "/" + page, "GET")
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }
}