import { Component, OnInit } from "@angular/core";
import { MenuModule } from "primeng/menu";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "primeng/avatar";
import { Ripple } from "primeng/ripple";
import { Badge } from "primeng/badge";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-user-menu",
    templateUrl: "./UserMenuComponent.html",
    imports: [MenuModule, Avatar, Ripple, Badge, NgIf, RouterLink],
})
export class UserMenuComponent implements OnInit {
    isLoading: boolean = false;
    userMenuItems: MenuItem[] = [
        {
            label: "Account",
            icon: "pi pi-fw pi-user",
            url: "/account/profile",
        },
        {
            label: "Settings",
            icon: "pi pi-fw pi-cog",
            url: "/account/settings",
        },
        {
            label: "Logout",
            icon: "pi pi-fw pi-power-off",
            url: "/account/logout",
        },
    ];
    protected readonly faUser = faUser;

    ngOnInit(): void {}
}
