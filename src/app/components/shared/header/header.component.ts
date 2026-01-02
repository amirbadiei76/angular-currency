import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  currentTheme = 'light'
  isDark: boolean = false;
  @Output() menuClick = new EventEmitter<void>();
  themeService: ThemeService;

  constructor (private theme: ThemeService) {
    this.themeService = theme;
    this.themeService.getStringTheme();
  }

  ngOnInit() {
    this.themeService.getStringTheme();
  }

  openMenu() {
    this.menuClick.emit();
  }

  changeTheme() {    
    this.themeService.cycleTheme();
  }
}
