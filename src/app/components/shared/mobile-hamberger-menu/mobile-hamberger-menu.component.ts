import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-hamberger-menu',
  imports: [RouterLink, RouterModule, RouterLinkActive],
  templateUrl: './mobile-hamberger-menu.component.html',
  styleUrl: './mobile-hamberger-menu.component.css'
})
export class MobileHambergerMenuComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  closeMenu() {
    this.close.emit();
  }

}
