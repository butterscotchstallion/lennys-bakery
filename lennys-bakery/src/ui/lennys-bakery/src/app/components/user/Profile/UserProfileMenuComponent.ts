import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-user-profile-menu",
    templateUrl: "./UserProfileMenuComponent.html",
    styleUrls: [],
    imports: [RouterLink],
})
export class UserProfileMenuComponent {
    public menuItems: MenuItem[] = [
        {
            label: "About",
            icon: "pi pi-fw pi-user",
            url: "/account/profile",
        },
        {
            label: "Orders",
            icon: "pi pi-shopping-cart",
            url: "/account/orders",
        },
        {
            label: "Addresses",
            icon: "pi pi-address-book",
            url: "/account/addresses",
        },
        {
            label: "Payment Methods",
            icon: "pi pi-credit-card",
            url: "/account/payment-methods",
        },
        {
            label: "Rapid Ship",
            icon: "pi pi-truck",
            url: "/account/rapid-ship",
        },
    ];
}
