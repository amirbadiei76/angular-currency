import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RequestArrayService } from '../../services/request-array.service';
import { NotFoundBoxComponent } from '../../components/shared/not-found-box/not-found-box.component';

@Component({
  selector: 'app-not-found',
  imports: [NotFoundBoxComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  
  constructor(private requestClass: RequestArrayService, private meta: Meta) {
      requestClass.setupMainData();
  }

  ngOnInit () {
    this.meta.updateTag({
      name: 'description',
      content: 'صفحه‌ای که به دنبال آن هستید پیدا نشد. لطفاً به صفحه اصلی ارزیاب بازگردید.'
    });
  
    this.meta.updateTag({
      name: 'robots',
      content: 'noindex, follow'
    });
  }
}
