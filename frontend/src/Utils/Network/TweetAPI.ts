import BaseAPI from "./BaseAPI";

export class TweetAPI extends BaseAPI {
    constructor() {
        super();
    }

    async refresh() {
        let response = await this.sendRequestAuthorized("/api/v1/tweet/feed", "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }

    async fetch(profileId: string) {
        let response = await this.sendRequestAuthorized("/api/v1/tweet/fetch/" + profileId, "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }

    async postTweet(content: string) {
        let response = await this.sendRequestAuthorized("/api/v1/tweet/post", "POST", { "content": content });
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }
}