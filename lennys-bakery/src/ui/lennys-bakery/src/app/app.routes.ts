import { Routes } from "@angular/router";
import { ProductListComponent } from "./components/product-list/ProductListComponent";
import { UserProfileComponent } from "./components/user/Profile/UserProfileComponent";

export const routes: Routes = [
    { path: "", component: ProductListComponent },
    { path: "account/profile", component: UserProfileComponent },
];
