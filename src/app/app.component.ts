import { Component, ElementRef, Inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../app/components/shared/header/header.component';
import { NotificationComponent } from './components/shared/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'قیمت ارز و طلا';

  constructor (private router: Router, private route: ActivatedRoute) {
    
  }
  

  
}
