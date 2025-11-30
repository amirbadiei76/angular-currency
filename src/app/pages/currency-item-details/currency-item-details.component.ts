import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../components/shared/breadcrumb/breadcrumb.component';
import { CurrenciesService } from '../../services/currencies.service';
import { CurrencyItem } from '../../interface/Currencies';
import { RequestArrayService } from '../../services/request-array.service';
import { ItemInfoComponent } from '../../components/not-shared/currency-item-details/item-info/item-info.component';

@Component({
  selector: 'app-currency-item-details',
  imports: [BreadcrumbComponent, ItemInfoComponent],
  templateUrl: './currency-item-details.component.html',
  styleUrl: './currency-item-details.component.css'
})
export class CurrencyItemDetailsComponent {
  title: string = "";
  currencyItem?: CurrencyItem;

  breadCrumbItems: BreadcrumbItem[] = []

  constructor(private route: ActivatedRoute, private requestArray: RequestArrayService) {
    
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.title = params['title'];

      this.currencyItem = this.requestArray.allItemsList.find((item) => item.slugText == this.title)!;

      this.breadCrumbItems = [
        {
          title: 'صفحه اصلی', link: '/'
        },
        {
          title: this.currencyItem.title,
        }
      ]
    })
  }
}
