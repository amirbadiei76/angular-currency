import { Component, input, Input, output } from '@angular/core';
import { CurrencyItem } from '../../../../interface/Currencies';

@Component({
  selector: 'app-related-item',
  imports: [],
  templateUrl: './related-item.component.html',
  styleUrl: './related-item.component.css'
})
export class RelatedItemComponent {
  @Input() item?: CurrencyItem;
  @Input() index?: number;
  currentUnit = input(0)

}
