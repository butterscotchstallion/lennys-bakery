import { Routes } from "@angular/router";
import { UserProfileComponent } from "./components/user/Profile/UserProfileComponent";
import { ProductListPageComponent } from "./pages/ProductList/ProductListPageComponent";
import { ProductPageComponent } from "./pages/Product/ProductPageComponent";
import { AdminPageComponent } from "./pages/Admin/AdminPageComponent";
import { AdminInventoryPageComponent } from "./pages/Admin/Inventory/AdminInventoryPageComponent";

export const routes: Routes = [
    { path: "", component: ProductListPageComponent },
    { path: "inventory/item/:slug", component: ProductPageComponent },
    { path: "account/profile", component: UserProfileComponent },
    { path: "admin", component: AdminPageComponent },
    {
        path: "admin/inventory/item/:slug",
        component: AdminInventoryPageComponent,
    },
    {
        path: "admin/inventory/add-item",
        component: AdminInventoryPageComponent,
    },
];
