import { HttpService } from "./HttpService";
import { Tracking } from "../models/Tracking";

namespace Api {
    export class Tracker {
        private httpService: HttpService;
        public constructor() {
            this.httpService = new HttpService();
        }
        public postTracking(tracking: Tracking) {
            return this.httpService.post<void>("track", tracking);
        }

        
    }
}
export default Api;