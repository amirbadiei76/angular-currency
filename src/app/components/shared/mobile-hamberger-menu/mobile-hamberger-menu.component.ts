import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-hamberger-menu',
  imports: [RouterLink],
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
