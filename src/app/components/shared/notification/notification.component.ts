import { Component, inject } from '@angular/core';
import { NotificationItem, NotificationService } from '../../../services/notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  get current(): NotificationItem | undefined {
    const q = this.notificationService.queue$();
    return q.length > 0 ? q[0] : undefined;
  }

  remove() {
    this.notificationService.removeCurrent();
  }
}
