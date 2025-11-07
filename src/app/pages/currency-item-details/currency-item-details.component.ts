import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-currency-item-details',
  imports: [],
  templateUrl: './currency-item-details.component.html',
  styleUrl: './currency-item-details.component.css'
})
export class CurrencyItemDetailsComponent {
  title?: string = "";

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.title = params['title'];
    })
  }
}
