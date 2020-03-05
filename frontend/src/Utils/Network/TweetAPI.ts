import BaseAPI from "./BaseAPI";

export class TweetAPI extends BaseAPI {
    constructor() {
        super();
    }
    
    async search(text: string) {
        let response = await this.sendRequestAuthorized("/api/v1/tweet/search/" + text, "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }

    async refresh() {
        let response = await this.sendRequestAuthorized("/api/v1/tweet/feed", "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON,
            statusCode: response.status
        }
    }

    async fetch(username: string) {
        let response = await this.sendRequestAuthorized("/api/v1/tweet/fetch/" + username, "GET");
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