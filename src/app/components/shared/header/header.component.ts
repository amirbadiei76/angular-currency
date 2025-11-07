import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CurrenciesService } from '../../../services/currencies.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isDark: boolean = false;

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

  changeTheme() {    
    this.themeService.toggleTheme();
  }
}
