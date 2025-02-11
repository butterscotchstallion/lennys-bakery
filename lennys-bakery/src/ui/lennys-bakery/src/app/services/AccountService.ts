import { Injectable } from "@angular/core";
import { getApiUrl } from "./ApiService";
import { IAccountProfile } from "../models/IAccountProfile";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    private readonly apiUrl = getApiUrl("user");
    private accountCache: Map<number, IAccountProfile> = new Map();

    getProfile(
        userId: number,
        cached: boolean = true,
    ): Subject<IAccountProfile> {
        const profile$ = new Subject<IAccountProfile>();
        /*const cachedProfile = this.accountCache.get(userId);
        if (cachedProfile && cached) {
            profile$.next(cachedProfile);
        } else {*/
        fetch(this.apiUrl + "/" + userId + "/profile")
            .then((response) => {
                if (response.ok) {
                    response.json().then((profile: IAccountProfile) => {
                        this.accountCache.set(userId, profile);
                        profile$.next(profile);
                    });
                }
            })
            .catch((error) => {
                profile$.error(error);
            });
        //}
        return profile$;
    }
}
