import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '../../components/shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-currency-item-details',
  imports: [BreadcrumbComponent],
  templateUrl: './currency-item-details.component.html',
  styleUrl: './currency-item-details.component.css'
})
export class CurrencyItemDetailsComponent {
  title?: string = "";

  breadCrumbItems = [
    {
      title: 'صفحه اصلی', link: '/'
    },
    {
      title: this.title,
    }
  ]

  constructor(private route: ActivatedRoute) {
    console.log(this.breadCrumbItems)
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.title = params['title'];
    })
  }
}
