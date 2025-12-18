import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';
import { fromEvent } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommafyNumberDirective } from '../../directives/commafy-number.directive';
import { CurrencyItem } from '../../interfaces/data.types';
import { meltedToGram, trimDecimal } from '../../utils/CurrencyConverter';

interface CalculatorType {
  id: number,
  title: string
}

interface GoldTypes extends CalculatorType {

}

interface OunceTypes extends CalculatorType {

}

@Component({
  selector: 'app-gold-calculator',
  imports: [FormsModule, CommafyNumberDirective],
  templateUrl: './gold-calculator.component.html',
  styleUrl: './gold-calculator.component.css'
})
export class GoldCalculatorComponent {
  
  requestClass = inject(RequestArrayService)

  goldValue = signal('')
  weight = signal(1);
  wageValue = signal(1);
  taxValue = signal(10);
  profitValue = signal(1);

  profitType = signal(0)

  @ViewChild('typesBtn') typesBtn?: ElementRef<HTMLDivElement>
  @ViewChild('goldBtn') goldBtn?: ElementRef<HTMLDivElement>
  @ViewChild('ounceBtn') ounceBtn?: ElementRef<HTMLDivElement>

  currentGoldType = signal(0);
  currentGoldTypeDropdownOpen = signal(false);

  
  currentOunceType = signal(0);
  currentOunceTypeDropdownOpen = signal(false);

  calculatorType = signal(0);
  calculatorTypeDropdownOpen = signal(false)
  calculatorTypes: CalculatorType[] = [
    {
      id: 0,
      title: 'محاسبه طلای 18 عیار'
    },
    {
      id: 1,
      title: 'محاسبه طلای دست دوم'
    },
    {
      id: 2,
      title: 'محاسبه طلای آب شده'
    },
    {
      id: 3,
      title: 'تبدیل اونس به گرم'
    },
    {
      id: 4,
      title: 'تبدیل سوت به گرم'
    },
    {
      id: 5,
      title: 'تبدیل مثقال به گرم'
    },
    {
      id: 6,
      title: 'تبدیل قیراط به گرم'
    },
  ]

  ounceTypes: OunceTypes[] = [
    {
      id: 0,
      title: 'اونس'
    },
    {
      id: 1,
      title: 'مثقال'
    },
    {
      id: 2,
      title: 'سوت'
    },
    {
      id: 3,
      title: 'گرم'
    },
    {
      id: 4,
      title: 'قیراط'
    },
  ]

  goldTypes: GoldTypes[] = [
    {
      id: 0,
      title: 'طلای 18 عیار'
    },
    {
      id: 1,
      title: 'طلای 24 عیار'
    },
    {
      id: 2,
      title: 'طلای آب شده'
    },
    {
      id: 3,
      title: 'طلای دست دوم'
    },
    {
      id: 4,
      title: 'اونس'
    },
    {
      id: 5,
      title: 'مثقال'
    },
  ]


  gram18Value?: CurrencyItem;
  gram24Value?: CurrencyItem;
  goldMiniValue?: CurrencyItem;
  goldMesghalValue?: CurrencyItem;
  

  constructor () {
      effect(() => {
        // console.log(this.taxValue().toString().replaceAll(',', ''))
        


        if (this.currentGoldType() === 0) {
          this.goldValue.set(this.gram18Value?.tomanStringPrice!)
        }
        else if (this.currentGoldType() === 1) {
          this.goldValue.set(this.gram24Value?.tomanStringPrice!)
        }
        else if (this.currentGoldType() === 2) {
          const meltedValue = meltedToGram(this.goldMesghalValue?.tomanStringPrice!)
          this.goldValue.set(trimDecimal(meltedValue, 0) + '')
        }
        else if (this.currentGoldType() === 3) {
          this.goldValue.set(this.goldMiniValue?.tomanStringPrice!)
        }
      })


  }

  ngOnInit () {
    this.gram18Value = this.requestClass.allItemsList.find((item) => item.id == '1000217');
    this.gram24Value = this.requestClass.allItemsList.find((item) => item.id == '1000219');
    this.goldMiniValue = this.requestClass.allItemsList.find((item) => item.id == '1000220');
    this.goldMesghalValue = this.requestClass.allItemsList.find((item) => item.id == '1000223');
  }

  changeProfitType (value: number) {
    this.profitType.set(value)
  }

  
  toggleOunceTypeDropdown() {
    this.currentOunceTypeDropdownOpen.update((open) => !open)
  }

  toggleCalculatorTypeDropdown() {
    this.calculatorTypeDropdownOpen.update((open) => !open)
  }
  
  toggleGoldTypeDropdown() {
    this.currentGoldTypeDropdownOpen.update((open) => !open)
  }

  
  selectOunceType(item: GoldTypes) {
    this.currentOunceType.set(item.id)
    this.toggleOunceTypeDropdown()
  }

  selectGoldType(item: GoldTypes) {
    this.currentGoldType.set(item.id)
    this.toggleGoldTypeDropdown()
  }

  selectCalculatorType(item: CalculatorType) {
    this.calculatorType.set(item.id)
    this.toggleCalculatorTypeDropdown()

    if (this.calculatorType() === 0) {
      this.currentGoldType.set(0)
    }
    else if (this.calculatorType() === 1) {
      this.currentGoldType.set(3)
    }
    else if (this.calculatorType() === 2) {
      this.currentGoldType.set(2)
    }
    else if (this.calculatorType() === 3) {
      this.currentOunceType.set(0)
    }
    else if (this.calculatorType() === 4) {
      this.currentOunceType.set(2)
    }
    else if (this.calculatorType() === 5) {
      this.currentOunceType.set(1)
    }
    else if (this.calculatorType() === 6) {
      this.currentOunceType.set(4)
    }
  }

  ngAfterViewInit () {
    if (typeof document !== 'undefined') {
      fromEvent(document, 'click')
      .subscribe((event) => {
        const click = event.target as Node
        if (!this.typesBtn?.nativeElement.contains(click)) {
          this.calculatorTypeDropdownOpen.set(false)
        }
        if (!this.goldBtn?.nativeElement.contains(click)) {
          this.currentGoldTypeDropdownOpen.set(false)
        }
        if (!this.ounceBtn?.nativeElement.contains(click)) {
          this.currentOunceTypeDropdownOpen.set(false)
        }
      })
    }
  }

}
