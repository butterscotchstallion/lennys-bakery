import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IProduct } from "../models/IProduct";
import { getApiUrl } from "./ApiService";

@Injectable({
    providedIn: "root",
})
export class ProductAutocompleteService {
    private readonly apiUrl = getApiUrl("inventory");

    getSuggestions(query: string): Subject<IProduct[]> {
        const suggestions$ = new Subject<IProduct[]>();

        fetch(this.apiUrl + "/search?q=" + encodeURI(query))
            .then((response: Response) => {
                if (response.ok) {
                    response.json().then((products: IProduct[]) => {
                        suggestions$.next(products);
                    });
                } else {
                    suggestions$.error(response.body);
                }
            })
            .catch((error) => {
                suggestions$.error(error);
            });

        return suggestions$;
    }
}
