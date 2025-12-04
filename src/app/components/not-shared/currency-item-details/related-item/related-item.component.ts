import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../../../../interface/Currencies';

@Component({
  selector: 'app-related-item',
  imports: [],
  templateUrl: './related-item.component.html',
  styleUrl: './related-item.component.css'
})
export class RelatedItemComponent {
  @Input() item?: CurrencyItem;

}
