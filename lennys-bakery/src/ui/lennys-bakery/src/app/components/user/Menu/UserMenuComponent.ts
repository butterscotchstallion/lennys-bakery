import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { MenuModule } from "primeng/menu";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "primeng/avatar";
import { Ripple } from "primeng/ripple";
import { Badge } from "primeng/badge";
import { RouterLink } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { AccountService } from "../../../services/AccountService";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IAccountProfile } from "../../../models/IAccountProfile";

@Component({
    selector: "app-user-menu",
    templateUrl: "./UserMenuComponent.html",
    imports: [MenuModule, Avatar, Ripple, Badge, RouterLink],
})
export class UserMenuComponent implements OnInit {
    isLoading: boolean = false;
    userMenuItems: MenuItem[] = [
        {
            label: "Admin",
            icon: "pi pi-fw pi-user",
            url: "/admin",
        },
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
    accountProfile: IAccountProfile;
    protected readonly faUser = faUser;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private accountService: AccountService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.accountService
            .getProfile(2)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (accountProfile: IAccountProfile) => {
                    this.accountProfile = accountProfile;
                    this.isLoading = false;
                },
                error: () => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to load account info",
                    });
                    this.isLoading = false;
                },
            });
    }
}
