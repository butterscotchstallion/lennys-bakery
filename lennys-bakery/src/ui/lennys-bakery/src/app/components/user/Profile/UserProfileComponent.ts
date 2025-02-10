import { Component, OnInit } from "@angular/core";
import { UserProfileMenuComponent } from "./UserProfileMenuComponent";
import { Button } from "primeng/button";
import { Textarea } from "primeng/textarea";
import { AccountService } from "../../../services/AccountService";
import { IAccountProfile } from "../../../models/IAccountProfile";
import { Avatar } from "primeng/avatar";
import { CommonModule, NgIf } from "@angular/common";
import { ProgressSpinner } from "primeng/progressspinner";
import { Subject } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-user-profile",
    templateUrl: "./UserProfileComponent.html",
    imports: [
        UserProfileMenuComponent,
        Button,
        Textarea,
        Avatar,
        NgIf,
        CommonModule,
        ProgressSpinner,
        ReactiveFormsModule,
    ],
})
export class UserProfileComponent implements OnInit {
    accountProfile$: Subject<IAccountProfile>;

    constructor(private accountService: AccountService) {}

    ngOnInit(): void {
        this.accountProfile$ = this.accountService.getProfile(2);
    }

    uploadAvatar() {}
}
