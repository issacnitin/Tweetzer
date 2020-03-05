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
        let response = await this.sendRequestAuthorized("/api/v1/social/unfollow", "POST", {"follow": id});
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }

    async getFollowers() {
        let response = await this.sendRequestAuthorized("/api/v1/social/getfollowers", "GET");
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