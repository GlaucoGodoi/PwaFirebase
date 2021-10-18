import { Injectable } from "@angular/core";
import { Analytics, getAnalytics, logEvent } from "@firebase/analytics";

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private static svc:Analytics;

    public static LogEvent(eventName: string, params?: any): void {
        if(!AnalyticsService.svc) {
            AnalyticsService.svc = getAnalytics();
        }
        logEvent( AnalyticsService.svc,eventName, params);
    }
}
