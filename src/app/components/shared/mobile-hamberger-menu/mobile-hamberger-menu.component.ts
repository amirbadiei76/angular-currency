import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-mobile-hamberger-menu',
  imports: [RouterLink],
  templateUrl: './mobile-hamberger-menu.component.html',
  styleUrl: './mobile-hamberger-menu.component.css'
})
export class MobileHambergerMenuComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  router = inject(Router)
  currentRoute = signal('/')

  closeMenu() {
    this.close.emit();
  }

  ngOnInit () {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.urlAfterRedirects)
    })
  }
}
