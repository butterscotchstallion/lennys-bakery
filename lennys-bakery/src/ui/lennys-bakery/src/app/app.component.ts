import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faCartPlus,
    faCartShopping,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { CartComponent } from "./components/cart/CartComponent";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { UserMenuComponent } from "./components/user/Menu/UserMenuComponent";
import { InputText } from "primeng/inputtext";

@Component({
    selector: "app-root",
    imports: [
        RouterOutlet,
        FontAwesomeModule,
        CartComponent,
        ToastModule,
        UserMenuComponent,
        InputText,
        RouterLink,
    ],
    providers: [MessageService],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    title = "lennys-bakery";
    protected readonly faCartPlus = faCartPlus;
    protected readonly faCartShopping = faCartShopping;
    protected readonly faChevronDown = faChevronDown;
}
