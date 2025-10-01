import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isDark: boolean = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem("theme") == null) localStorage.setItem("theme", "light");
      else {
        if (localStorage.getItem("theme") === 'dark') {
          document.documentElement.classList.add("dark")
          this.isDark = true
        }
        else this.isDark = false;
      }
    }
  }

  changeTheme() {
    
    document.documentElement.classList.toggle("dark")
    this.isDark = document.documentElement.classList.contains("dark")!!

    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("theme", "dark")
    }
    else localStorage.setItem("theme", "light");
    
  }
}
