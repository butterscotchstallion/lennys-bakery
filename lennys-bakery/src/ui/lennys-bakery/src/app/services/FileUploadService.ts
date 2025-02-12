import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpEventType,
} from "@angular/common/http";
import { BehaviorSubject, catchError, EMPTY, finalize } from "rxjs";
import { getApiUrl } from "./ApiService";

@Injectable({
    providedIn: "root",
})
export class FileUploadService {
    private readonly apiUrl = getApiUrl();

    constructor(private http: HttpClient) {}

    uploadFile(
        url: string,
        formData: FormData,
    ): BehaviorSubject<HttpEvent<unknown>> {
        const upload$ = new BehaviorSubject<HttpEvent<unknown>>({
            type: HttpEventType.Sent,
        });

        const fullUrl = this.apiUrl + url;

        this.http
            .post<unknown>(fullUrl, formData, {
                reportProgress: true,
                observe: "events",
            })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    upload$.error(error);
                    return EMPTY;
                }),
                finalize(() => {
                    if (!upload$.closed) {
                        upload$.complete();
                    }
                }),
            )
            .subscribe((event) => upload$.next(event));

        return upload$;
    }
}
