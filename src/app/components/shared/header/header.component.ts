import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  currentTheme = 'light'
  isDark: boolean = false;
  @Output() menuClick = new EventEmitter<void>();
  themeService: ThemeService;
  router = inject(Router)
  currentRoute = signal('/')

  constructor (private theme: ThemeService) {
    this.themeService = theme;
    this.themeService.getStringTheme();
  }

  ngOnInit() {
    this.themeService.getStringTheme();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.urlAfterRedirects)
    })
  }

  openMenu() {
    this.menuClick.emit();
  }

  changeTheme() {    
    this.themeService.toggleTheme();
  }
}
