import { Component } from '@angular/core';
import { RequestArrayService } from '../services/request-array.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  reqestClass?: RequestArrayService;

  constructor (private requestArray: RequestArrayService) {
    this.reqestClass = requestArray
  }

}
