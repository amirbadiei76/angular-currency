import { Component, inject } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';

@Component({
  selector: 'app-converter',
  imports: [],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent {
  requestArray = inject(RequestArrayService)
  constructor() {
    console.log(this.requestArray)
    if (typeof window !== 'undefined') {      
      window.scrollTo(0, 0)
    }
  }

  ngOnInit () {
  }
}
