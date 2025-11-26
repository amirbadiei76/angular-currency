import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CurrencyItem } from '../../../../interface/Currencies';
import { CommonModule, NgIf } from '@angular/common';
import { StarIconComponent } from '../../../shared/star-icon/star-icon.component';
import { RequestArrayService } from '../../../../services/request-array.service';
import { toman_unit } from '../../../../constants/Values';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'currency-item',
  imports: [CommonModule, NgIf, StarIconComponent, RouterModule],
  templateUrl: './currency-item.component.html',
  styleUrl: './currency-item.component.css'
})
export class CurrencyItemComponent {
    
  @Input() currencyItem?: CurrencyItem;
  @Input() showCurrencyId?: number;
  @Output() favRemoved = new EventEmitter<string>();
  @Output() favAdded = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<string>();

  @ViewChild('starElement') starElement?: ElementRef<HTMLDivElement>

  requestArray?: RequestArrayService;

  currentCurrencyItem?: CurrencyItem;
  priceValue?: string | number;
  
  constructor(private requestService: RequestArrayService, private router: Router) {
    this.requestArray = requestService
    this.currentCurrencyItem = this.currencyItem;
  }
  
  ngOnInit () {
    this.priceValue = (this.currencyItem?.unit === toman_unit) ? this.currencyItem.tomanStringPrice : this.currencyItem?.lastPriceInfo.p
  }

  addToFav() {
    this.requestArray?.addToFavorite(this.currencyItem!)
    this.favAdded.emit(this.currencyItem!.id)
  }

  removeFromFav() {
    this.requestArray?.removeFromFavorite(this.currencyItem?.id!)
    this.favRemoved.emit(this.currencyItem!.id)
  }

  onSelectItem(event: MouseEvent) {
    if (!this.starElement?.nativeElement.contains((event.target as Node))) {
      this.itemSelected.emit(this.currencyItem!.id)
      this.router.navigate([`/${this.currencyItem!.slugText}`])
    }
  }

}
