import BaseAPI from "./BaseAPI";

export class TweetAPI extends BaseAPI {
    constructor() {
        super();
    }

    async refresh() {
        let response = await this.sendRequest("/api/v1/tweet/refresh", "GET");
        let responseJSON = await response.json();
        return {
            body: responseJSON.body,
            statusCode: responseJSON.status
        }
    }
}