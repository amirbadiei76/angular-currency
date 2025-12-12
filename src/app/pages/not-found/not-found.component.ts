import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RequestArrayService } from '../../services/request-array.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  
  constructor(private requestClass: RequestArrayService) {
      requestClass.setupMainData();
  }
}
