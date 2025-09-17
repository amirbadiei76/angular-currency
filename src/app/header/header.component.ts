import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  ngOnInit() {
    if (typeof window !== 'undefined' && localStorage.getItem("theme") == null) localStorage.setItem("theme", "light");

  }

  changeTheme() {
    
    document.documentElement.classList.toggle("dark")

    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("theme", "dark")
    }
    else localStorage.setItem("theme", "light");
    
  }
}
