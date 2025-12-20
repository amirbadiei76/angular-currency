import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RequestArrayService } from '../../services/request-array.service';
import { NotFoundBoxComponent } from '../../components/shared/not-found-box/not-found-box.component';

@Component({
  selector: 'app-not-found',
  imports: [NotFoundBoxComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  
  constructor(private requestClass: RequestArrayService) {
      requestClass.setupMainData();
  }
}
