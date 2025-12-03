import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../components/shared/breadcrumb/breadcrumb.component';
import { CurrencyItem } from '../../interface/Currencies';
import { RequestArrayService } from '../../services/request-array.service';
import { ItemInfoComponent } from '../../components/not-shared/currency-item-details/item-info/item-info.component';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { BASE_METALS_PREFIX, COIN_PREFIX, COMMODITY_PREFIX, CRYPTO_PREFIX, GOLD_PREFIX, MAIN_CURRENCY_PREFIX, PRECIOUS_METALS_PREFIX, WORLD_MARKET_PREFIX } from '../../constants/Values';
import { SearchItemComponent } from '../../components/not-shared/currency-item-details/search-item/search-item.component';

@Component({
  selector: 'app-currency-item-details',
  imports: [BreadcrumbComponent, ItemInfoComponent, SearchItemComponent],
  templateUrl: './currency-item-details.component.html',
  styleUrl: './currency-item-details.component.css'
})
export class CurrencyItemDetailsComponent {
  title?: string = "";
  currencyItem?: CurrencyItem;
  currentCategoryItems?: CurrencyItem[];
  currentFilteredList?: CurrencyItem[];
  themeServiceInstance?: ThemeService;
  breadCrumbItems: BreadcrumbItem[] = [];
  listDisplay: string = 'hidden';

  @ViewChild('itemList') itemList?: ElementRef<HTMLDivElement>;
  @ViewChild('inputContainer') inputContainer?: ElementRef;


  constructor(private route: ActivatedRoute, private requestArray: RequestArrayService, private notificationService: NotificationService, private themeService: ThemeService, private router: Router) {
    this.themeServiceInstance = themeService;
  }
  

  inputFocus () {
    // this.itemList?.nativeElement.classList.remove('hidden')
    // this.itemList?.nativeElement.classList.add('flex')
    this.listDisplay = 'flex'
  }

  
  inputBlur () {
    // this.itemList?.nativeElement.classList.remove('flex')
    // this.itemList?.nativeElement.classList.add('hidden')
    this.listDisplay = 'none'
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clicked = event.target as Node;
    if (!this.inputContainer?.nativeElement.contains(clicked)) {
      // this.inputBlur()
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // this.inputBlur()
  }

  onItemSelect(slug: string) {
    this.inputBlur()
    this.router.navigate([`/${slug}`])
  }

  
  filterList(event: Event) {
    const listToFilter = [...this.currentCategoryItems!!]
    const textToFilter = (event.target as HTMLInputElement).value.toLowerCase();
    if (textToFilter !== null) {
      this.currentFilteredList = listToFilter.filter(item => item.title.toLowerCase().includes(textToFilter) || item.shortedName?.toLowerCase().includes(textToFilter))
    }
  }

  sharePage () {
    const url = window.location.href;

    if (!navigator.share) {
      navigator.clipboard.writeText(url);
      this.notificationService.show('آدرس صفحه در کلیپ بورد ذخیره شد')
      return;
    }

    navigator.share({ url })
      .catch(() => console.warn("Share dialog dismissed"));
  }

  initializeCurrentCategoryItems () {
    switch (this.currencyItem?.groupName) {
      case MAIN_CURRENCY_PREFIX:
        this.currentCategoryItems = this.requestArray.mainCurrencyList;
        break;
      case CRYPTO_PREFIX:
        this.currentCategoryItems = this.requestArray.cryptoList;
        break;
      case GOLD_PREFIX:
        this.currentCategoryItems = this.requestArray.goldList;
        break;
      case COIN_PREFIX:
        this.currentCategoryItems = this.requestArray.coinList;
        break;
      case WORLD_MARKET_PREFIX:
        this.currentCategoryItems = this.requestArray.worldMarketList;
        break;
      case PRECIOUS_METALS_PREFIX:
        this.currentCategoryItems = this.requestArray.preciousMetalList;
        break;
      case BASE_METALS_PREFIX:
        this.currentCategoryItems = this.requestArray.baseMetalList;
        break;
      case COMMODITY_PREFIX:
        this.currentCategoryItems = this.requestArray.commodityList;
        break;
      default:
        this.currentCategoryItems = this.requestArray.mainCurrencyList;
        break;
    }
    this.currentFilteredList = this.currentCategoryItems;
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
      ];
      this.initializeCurrentCategoryItems();
    })
  }
}
