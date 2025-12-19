import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';
import { fromEvent } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommafyNumberDirective } from '../../directives/commafy-number.directive';
import { CurrencyItem } from '../../interfaces/data.types';
import { caratToGram, commafy, gramToCarat, gramToMesghal, gramToOunce, gramToSut, mesghalToGram, mesghalToGramMoney, ounceToGram, sutToGram, trimDecimal } from '../../utils/CurrencyConverter';

interface CalculatorType {
  id: number,
  title: string
}

interface GoldTypes extends CalculatorType {
  weightUnit?: string
}

interface OunceTypes extends CalculatorType {
  value?: string
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
  weightValue = signal('1');
  wageValue = signal('1');
  taxValue = signal(10);
  profitValue = signal(1);

  profitType = signal(0)

  totalGoldValue = signal(1);
  mainGoldValue = signal(1);
  totalWageValue = signal(1);
  totalProfitValue = signal(1);
  totalTaxValue = signal(1);
  

  @ViewChild('typesBtn') typesBtn?: ElementRef<HTMLDivElement>
  @ViewChild('goldBtn') goldBtn?: ElementRef<HTMLDivElement>
  @ViewChild('ounceBtn') ounceBtn?: ElementRef<HTMLDivElement>


  currentSelectedCurrency? = signal<CurrencyItem | undefined>(undefined)
  currentGoldType = signal(0);
  currentGoldTypeDropdownOpen = signal(false);
  
  currentOunceType = signal(0);
  currentOunceTypeDropdownOpen = signal(false);

  calculatorType = signal(0);
  calculatorTypeDropdownOpen = signal(false)
  calculatorTypes: CalculatorType[] = [
    {
      id: 0,
      title: 'محاسبه قیمت طلا'
    },
    {
      id: 1,
      title: 'تبدیل واحدهای طلا'
    },
  ]

  ounceTypes: OunceTypes[] = [
    {
      id: 0,
      title: 'گرم',
      value: '0'
    },
    {
      id: 1,
      title: 'اونس',
      value: '0'
    },
    {
      id: 2,
      title: 'مثقال',
      value: '0'
    },
    {
      id: 3,
      title: 'سوت',
      value: '0'
    },
    {
      id: 4,
      title: 'قیراط',
      value: '0'
    },
  ]

  goldTypes: GoldTypes[] = [
    {
      id: 0,
      title: 'طلای 18 عیار',
      weightUnit: 'گرم'
    },
    {
      id: 1,
      title: 'طلای 24 عیار',
      weightUnit: 'گرم'
    },
    {
      id: 2,
      title: 'طلای آب شده',
      weightUnit: 'گرم'
    },
    {
      id: 3,
      title: 'طلای دست دوم',
      weightUnit: 'گرم'
    },
    {
      id: 4,
      title: 'اونس',
      weightUnit: 'اونس'
    },
    {
      id: 5,
      title: 'مثقال',
      weightUnit: 'مثقال'
    },
  ]


  gram18Value?: CurrencyItem;
  gram24Value?: CurrencyItem;
  goldMiniValue?: CurrencyItem;
  goldFuturesValue?: CurrencyItem;
  goldMesghalValue?: CurrencyItem;
  goldOunceValue?: CurrencyItem;
  

  constructor () {
    

      this.initAllGoldValues();
      this.initFirstGoldValue();
    

      effect(() => {
        if (this.calculatorType() === 0) {
          this.initFirstGoldValue();

        }
        else if (this.calculatorType() === 1) {
        
          this.calculateOunceTypes()
        }
        
        
      })


  }

  initAllGoldValues () {
    this.gram18Value = this.requestClass.allItemsList.find((item) => item.id == '1000217');
    this.gram24Value = this.requestClass.allItemsList.find((item) => item.id == '1000219');
    this.goldMiniValue = this.requestClass.allItemsList.find((item) => item.id == '1000220');
    this.goldFuturesValue = this.requestClass.allItemsList.find((item) => item.id == '1000227');
    this.goldMesghalValue = this.requestClass.allItemsList.find((item) => item.id == '1000223');
    this.goldOunceValue = this.requestClass.allItemsList.find((item) => item.id == '1000244');
  }

  initFirstGoldValue () {
    this.currentGoldType.set(0)
    this.goldValue.set(this.gram18Value?.tomanStringPrice!)
    this.currentSelectedCurrency?.set(this.gram18Value)
  }

  calculateOunceTypes () {
    const value = this.weightValue();
    switch(this.currentOunceType()) {
      // Gram
      case 0:
        const ounceValue = gramToOunce(value)
        const mesghalValue = gramToMesghal(value)
        const sutValue = gramToSut(value)
        const caratValue = gramToCarat(value)
        const currentGramTypes = [...this.ounceTypes]
        currentGramTypes[1] = {...currentGramTypes[1], value: commafy(trimDecimal(ounceValue, 3))}
        currentGramTypes[2] = {...currentGramTypes[2], value: commafy(trimDecimal(mesghalValue, 4))}
        currentGramTypes[3] = {...currentGramTypes[3], value: commafy(trimDecimal(sutValue, 0))}
        currentGramTypes[4] = {...currentGramTypes[4], value: commafy(trimDecimal(caratValue, 2))}
        this.ounceTypes = currentGramTypes;
        break;

      // Ounce
      case 1:
        const ounceGramValue = ounceToGram(value)
        const ounceMesghalValue = gramToMesghal(ounceGramValue + '')
        const ounceSutValue = gramToSut(ounceGramValue + '')
        const ounceCaratValue = gramToCarat(ounceGramValue + '')
        const ounceCurrentTypes = [...this.ounceTypes]
        ounceCurrentTypes[0] = {...ounceCurrentTypes[0], value: commafy(trimDecimal(ounceGramValue, 3))}
        ounceCurrentTypes[2] = {...ounceCurrentTypes[2], value: commafy(trimDecimal(ounceMesghalValue, 4))}
        ounceCurrentTypes[3] = {...ounceCurrentTypes[3], value: commafy(trimDecimal(ounceSutValue, 0))}
        ounceCurrentTypes[4] = {...ounceCurrentTypes[4], value: commafy(trimDecimal(ounceCaratValue, 2))}
        this.ounceTypes = ounceCurrentTypes;
        break;
      
      // Mesghal
      case 2:
        const mesghalGramValue = mesghalToGram(value)
        const mesghalOunceValue = gramToOunce(mesghalGramValue + '')
        const mesghalSutValue = gramToSut(mesghalGramValue + '')
        const mesghalCaratValue = gramToCarat(mesghalGramValue + '')
        const mesghalCurrentTypes = [...this.ounceTypes]
        mesghalCurrentTypes[0] = {...mesghalCurrentTypes[0], value: commafy(trimDecimal(mesghalGramValue, 3))}
        mesghalCurrentTypes[1] = {...mesghalCurrentTypes[1], value: commafy(trimDecimal(mesghalOunceValue, 3))}
        mesghalCurrentTypes[3] = {...mesghalCurrentTypes[3], value: commafy(trimDecimal(mesghalSutValue, 0))}
        mesghalCurrentTypes[4] = {...mesghalCurrentTypes[4], value: commafy(trimDecimal(mesghalCaratValue, 2))}
        this.ounceTypes = mesghalCurrentTypes;
        break;

      // Sut
      case 3:
        const sutGramValue = sutToGram(value)
        const sutOunceValue = gramToOunce(sutGramValue + '')
        const sutMesghalValue = gramToMesghal(sutGramValue + '')
        const sutCaratValue = gramToCarat(sutGramValue + '')
        const sutCurrentTypes = [...this.ounceTypes]
        sutCurrentTypes[0] = {...sutCurrentTypes[0], value: commafy(trimDecimal(sutGramValue, 3))}
        sutCurrentTypes[1] = {...sutCurrentTypes[1], value: commafy(trimDecimal(sutOunceValue, 3))}
        sutCurrentTypes[2] = {...sutCurrentTypes[2], value: commafy(trimDecimal(sutMesghalValue, 4))}
        sutCurrentTypes[4] = {...sutCurrentTypes[4], value: commafy(trimDecimal(sutCaratValue, 2))}
        this.ounceTypes = sutCurrentTypes;
        break;

      // Carat
      case 4:
        const caratGramValue = caratToGram(value)
        const caratOunceValue = gramToOunce(caratGramValue + '')
        const caratMesghalValue = gramToMesghal(caratGramValue + '')
        const caratSutValue = gramToSut(caratGramValue + '')
        const currentOunceTypes = [...this.ounceTypes]
        currentOunceTypes[0] = {...currentOunceTypes[0], value: commafy(trimDecimal(caratGramValue, 3))}
        currentOunceTypes[1] = {...currentOunceTypes[1], value: commafy(trimDecimal(caratOunceValue, 3))}
        currentOunceTypes[2] = {...currentOunceTypes[2], value: commafy(trimDecimal(caratMesghalValue, 4))}
        currentOunceTypes[3] = {...currentOunceTypes[3], value: commafy(trimDecimal(caratSutValue, 0))}
        this.ounceTypes = currentOunceTypes;
        break;
    }
  }

  onWeightInputChange (event: Event) {
    const weightValue = (event.target as HTMLInputElement).value;
    this.weightValue.set(commafy(Number(weightValue.replace(/,/g, '') || 1)))
  }

  ngOnInit () {
    
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
    
    if (this.currentOunceType() === 3) this.weightValue.set('1,000')
    else if (this.currentOunceType() === 4) this.weightValue.set('5')
    else this.weightValue.set('1')
  }

  selectGoldType(item: GoldTypes) {
    this.currentGoldType.set(item.id)
    this.toggleGoldTypeDropdown()

    if (this.currentGoldType() === 0) {
      this.goldValue.set(this.gram18Value?.tomanStringPrice!)
      this.currentSelectedCurrency?.set(this.gram18Value)
    }
    else if (this.currentGoldType() === 1) {
      this.goldValue.set(this.gram24Value?.tomanStringPrice!)
      this.currentSelectedCurrency?.set(this.gram24Value)
    }
    else if (this.currentGoldType() === 2) {
      const meltedValue = mesghalToGramMoney(this.goldFuturesValue?.tomanStringPrice!)
      this.goldValue.set(commafy(trimDecimal(meltedValue, 0)))
      this.currentSelectedCurrency?.set(this.goldFuturesValue)
    }
    else if (this.currentGoldType() === 3) {
      this.goldValue.set(this.goldMiniValue?.tomanStringPrice!)
      this.currentSelectedCurrency?.set(this.goldMiniValue)
    }
    else if (this.currentGoldType() === 4) {
      this.goldValue.set(this.goldOunceValue?.tomanStringPrice!)
      this.currentSelectedCurrency?.set(this.goldOunceValue)
    }
    else if (this.currentGoldType() === 5) {
      this.goldValue.set(this.goldMesghalValue?.tomanStringPrice!)
      this.currentSelectedCurrency?.set(this.goldMesghalValue)
    }

    if (this.currentGoldType() === 4 || this.currentGoldType() === 5) {

    }
    else {

    }
  }

  selectCalculatorType(item: CalculatorType) {
    this.calculatorType.set(item.id)
    this.toggleCalculatorTypeDropdown()

    if (this.calculatorType() === 0) {
      this.currentGoldType.set(0)
    }
    else if (this.calculatorType() === 1) {
      this.currentOunceType.set(0)
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
