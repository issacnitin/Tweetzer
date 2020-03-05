import BaseAPI from './BaseAPI';

export default class SocialAPI extends BaseAPI {
    constructor() {
        super()
    }

    async follow(id: string) {
        let response = await this.sendRequestAuthorized("/api/v1/social/follow/" + id, "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }
    
    async unfollow(id: string) {
        let response = await this.sendRequestAuthorized("/api/v1/social/unfollow/" + id, "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }

    async getFollowers(username: string) {
        let response = await this.sendRequestAuthorized("/api/v1/social/getfollowers/" + username, "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }

    async getFollowing(username: string) {
        let response = await this.sendRequestAuthorized("/api/v1/social/getfollowing/" + username, "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }
} 