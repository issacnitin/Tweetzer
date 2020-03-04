import BaseAPI from './BaseAPI';

export default class IdentityAPI extends BaseAPI {
    constructor() {
        super()
    }

    async getProfile(profileId: string) {
        let response = await this.sendRequestAuthorized("/api/v1/profile/getprofile/"+profileId, "GET")
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

    async searchUser(text: string) {
        let response = await this.sendRequestAuthorized("/api/v1/profile/search/" + text, "GET")
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }
}