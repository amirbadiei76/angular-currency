import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-loading-shell',
  imports: [RouterOutlet],
  templateUrl: './loading-shell.component.html',
  styleUrl: './loading-shell.component.css'
})
export class LoadingShellComponent {

  router = inject(Router)
  loading = false;
  constructor () {
    this.router.events.subscribe(e => {
      this.loading = e instanceof NavigationStart;
    });
  }
}
