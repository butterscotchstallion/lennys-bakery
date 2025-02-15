import { Routes } from "@angular/router";
import { UserProfileComponent } from "./components/user/Profile/UserProfileComponent";
import { ProductListPageComponent } from "./pages/ProductList/ProductListPageComponent";
import { ProductPageComponent } from "./pages/Product/ProductPageComponent";

export const routes: Routes = [
    { path: "", component: ProductListPageComponent },
    { path: "inventory/item/:slug", component: ProductPageComponent },
    { path: "account/profile", component: UserProfileComponent },
];
