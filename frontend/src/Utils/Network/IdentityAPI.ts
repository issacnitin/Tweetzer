import BaseAPI from './BaseAPI';

export default class IdentityAPI extends BaseAPI {
    constructor() {
        super()
    }

    async getProfile(profileId: string) {

    }

    async getMyProfile() {
        let response = await this.sendRequestAuthorized("/api/v1/profile/getme", "GET")
        let responseBody = await response.json();
        return {
            body: responseBody,
            statusCode: response.status
        }
    }
}