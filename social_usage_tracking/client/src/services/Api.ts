import { HttpService } from "./HttpService";
import { Tracking } from "../models/Tracking";

namespace Api {
    export class Tracker {
        private httpService: HttpService;
        public constructor() {
            this.httpService = new HttpService();
        }
        public postTracking(tracking: Tracking) {
            const objectToSend: any = tracking;
            objectToSend.location = JSON.stringify(objectToSend.location);
            return this.httpService.post<void>("track", tracking);
        }

        
    }
}
export default Api;