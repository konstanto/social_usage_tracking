export class HttpService {
    private buildQueryString(parameters: {}) {
        const queryStringParameters: string[] = [];
        for (let parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
                let value = parameters[parameter];
                if (value == null) {
                    value = "";
                }
                queryStringParameters.push(encodeURIComponent(parameter) + "=" + encodeURIComponent(value));
            }
        }
        let queryString = queryStringParameters.join("&");

        if (queryString.length > 0) {
            queryString = `?${queryString}`;
        }
        return queryString;
    }

    private request(method: "GET" | "POST" | "DELETE" | "PUT", endpoint: string, data: {}) {
        if (method === "GET" || method === "DELETE") {
            endpoint = endpoint + this.buildQueryString(data);
        } 

        const rootUrl = "http://konstantyner.org/social_usage_tracking/";

        return fetch(rootUrl + 'api/' + endpoint, {
            method: method,
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": localStorage.getItem('estateVidenJWT') != null ? "Bearer " + localStorage.getItem('estateVidenJWT') : null
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: method !== "GET" && method !== "DELETE" ? JSON.stringify(data) : null
        })
            .then((response) => {
                return response.json()
                    .then(function (json) {
                        if (response.ok) {
                            return json;
                        } else {
                            return Promise.reject(response);
                        }
                    });
            })
            .catch(function (error) {
                console.log('error', error);
            });
    }

    public post<t>(endpoint: string, data: {}): Promise<t> {
        return this.request("POST", endpoint, data);
    }

    public get<t>(endpoint: string, data?: {}): Promise<t> {
        return this.request("GET", endpoint, data);
    }

    public delete(endpoint: string, data: {}) {

    }

    public put(endpoint: string, data: {}) {

    }
}