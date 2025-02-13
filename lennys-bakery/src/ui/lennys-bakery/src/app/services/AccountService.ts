import { Injectable } from "@angular/core";
import { getApiUrl } from "./ApiService";
import { IAccountProfile } from "../models/IAccountProfile";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    private readonly apiUrl = getApiUrl("user");

    updateProfile(accountProfile: IAccountProfile): Subject<IAccountProfile> {
        const profile$ = new Subject<IAccountProfile>();
        fetch(this.apiUrl + "/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(accountProfile),
        })
            .then((response: Response) => {
                if (response.ok) {
                    response.json().then((profile: IAccountProfile) => {
                        profile$.next(profile);
                    });
                }
            })
            .catch((error) => {
                profile$.error(error);
            });
        return profile$;
    }

    getProfile(userId: number): Subject<IAccountProfile> {
        const profile$ = new Subject<IAccountProfile>();
        fetch(this.apiUrl + "/" + userId + "/profile")
            .then((response) => {
                if (response.ok) {
                    response.json().then((profile: IAccountProfile) => {
                        profile$.next(profile);
                    });
                }
            })
            .catch((error) => {
                profile$.error(error);
            });
        return profile$;
    }
}
