import { Component, Input, signal } from '@angular/core';
import { CurrencyItem } from '../../../../interface/Currencies';
import { RelatedItemComponent } from '../related-item/related-item.component';

@Component({
  selector: 'app-currency-overview',
  imports: [RelatedItemComponent],
  templateUrl: './currency-overview.component.html',
  styleUrl: './currency-overview.component.css'
})
export class CurrencyOverviewComponent {
  @Input() relatedItems?: CurrencyItem[];

  currentType = signal(0);
  currentList = signal(this.relatedItems?.slice(0, 5));

  changeCurrentType (value: number) {
    this.currentType.set(value)
    console.log(this.currentType())
  }

}
