import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isDark: boolean = false;
  @Output() menuClick = new EventEmitter<void>();
  themeService: ThemeService;

  constructor (private theme: ThemeService) {
    this.themeService = theme;
    this.themeService.getStringTheme();
    // if (typeof window !== 'undefined') {
    //   if (localStorage.getItem("theme") == null) localStorage.setItem("theme", "light");
    //   else {
    //     if (localStorage.getItem("theme") === 'dark') {
    //       document.documentElement.classList.add("dark")
    //       this.isDark = true
    //     }
    //     else this.isDark = false;
    //   }
    // }
  }

  ngOnInit() {
    this.themeService.getStringTheme();
  }

  openMenu() {
    this.menuClick.emit();
  }

  changeTheme() {    
    this.themeService.toggleTheme();
  }
}
