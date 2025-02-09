import { Component, OnInit } from "@angular/core";
import { MenuModule } from "primeng/menu";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "primeng/avatar";
import { Ripple } from "primeng/ripple";
import { Badge } from "primeng/badge";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-user-menu",
    templateUrl: "./UserMenuComponent.html",
    imports: [MenuModule, Avatar, Ripple, Badge, NgIf, RouterLink],
})
export class UserMenuComponent implements OnInit {
    userMenuVisible = false;
    userMenuItems = [
        {
            label: "Account",
            icon: "pi pi-fw pi-user",
            path: "/account/profile",
        },
        {
            label: "Settings",
            icon: "pi pi-fw pi-cog",
            path: "/account/settings",
        },
        {
            label: "Logout",
            icon: "pi pi-fw pi-power-off",
            path: "/account/logout",
        },
    ];
    protected readonly faUser = faUser;

    ngOnInit(): void {}
}
