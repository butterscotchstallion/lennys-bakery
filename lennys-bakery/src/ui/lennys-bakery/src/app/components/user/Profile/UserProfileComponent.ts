import { Component, OnInit } from "@angular/core";
import { UserProfileMenuComponent } from "./UserProfileMenuComponent";
import { Button } from "primeng/button";
import { Textarea } from "primeng/textarea";

@Component({
    selector: "app-user-profile",
    templateUrl: "./UserProfileComponent.html",
    imports: [UserProfileMenuComponent, Button, Textarea],
})
export class UserProfileComponent implements OnInit {
    ngOnInit(): void {}

    uploadAvatar() {}
}
