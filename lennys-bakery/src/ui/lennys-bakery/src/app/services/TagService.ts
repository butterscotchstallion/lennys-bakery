import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ITag } from "../models/ITag";
import { getApiUrl } from "./ApiService";

@Injectable({
    providedIn: "root",
})
export class TagService {
    private readonly apiUrl = getApiUrl("tags");

    getTags() {
        const tags$ = new Subject<ITag[]>();

        fetch(this.apiUrl).then((response: Response) => {
            if (response.ok) {
                response.json().then((tags: ITag[]) => {
                    tags$.next(tags);
                });
            } else {
                tags$.error(response.body);
            }
        });

        return tags$;
    }
}
