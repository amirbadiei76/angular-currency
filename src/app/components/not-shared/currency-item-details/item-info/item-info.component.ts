import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../../../../interface/Currencies';
import { StarIconComponent } from '../../../shared/star-icon/star-icon.component';
import { RequestArrayService } from '../../../../services/request-array.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-item-info',
  imports: [StarIconComponent, NgIf],
  templateUrl: './item-info.component.html',
  styleUrl: './item-info.component.css'
})
export class ItemInfoComponent {
    @Input() item?: CurrencyItem;
    requestArray?: RequestArrayService;

    constructor (private requestService: RequestArrayService) {
      this.requestArray = requestService
    }

    ngOnInit () {
      console.log(this.item)
    }

    addToFav(event: MouseEvent) {
      event.stopPropagation()
      this.requestArray?.addToFavorite(this.item!)
    }
  
    removeFromFav(event: MouseEvent) {
      event.stopPropagation()
      this.requestArray?.removeFromFavorite(this.item?.id!)
    }
}
