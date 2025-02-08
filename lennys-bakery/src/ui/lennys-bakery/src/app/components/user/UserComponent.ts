import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-user-menu',
  templateUrl: './UserMenuComponent.html',
  imports: [MenuModule, Avatar],
})
export class UserMenuComponent implements OnInit {
  userMenuVisible = false;
  userMenuItems = [
    { label: 'Profile', icon: 'pi pi-fw pi-user' },
    { label: 'Settings', icon: 'pi pi-fw pi-cog' },
    { label: 'Logout', icon: 'pi pi-fw pi-power-off' },
  ];
  protected readonly faUser = faUser;

  ngOnInit(): void {}
}
