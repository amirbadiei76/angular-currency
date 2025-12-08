import { Component, input, Input, signal } from '@angular/core';
import { RawData } from '../../../../interfaces/chart.types';
import { analyzeRange, filterByDays } from '../../../../utils/CurrencyChanges';
import { CurrencyItem } from '../../../../interfaces/data.types';
import { RequestArrayService } from '../../../../services/request-array.service';

export type PriceItem = RawData & { date: Date };

interface ChangesResult {
  first?: string;
  last?: string;
  change?: number;
  percent?: string;
  avg?: number | string;
  direction?: string;
  days: number;
}

@Component({
  selector: 'app-changes-table',
  imports: [],
  templateUrl: './changes-table.component.html',
  styleUrl: './changes-table.component.css'
})

export class ChangesTableComponent {
  @Input() historyData?: RawData[];
  @Input() item?: CurrencyItem;
  currentUnit = input(0)

  ranges = signal<ChangesResult[]>([])

  requestClass: RequestArrayService;
  
  constructor (private requestArray: RequestArrayService) {
      this.requestClass = requestArray;
  }

  normalize(data: RawData[]): PriceItem[] {
    return data.map((item: RawData) => ({
      ...item,
      date: new Date(item.ts)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  ngOnChanges() {
    if (this.historyData) {
      const normalized = this.normalize(this.historyData);
      this.calculateRanges(normalized, this.item!, this.currentUnit());
    }
  }

  calculateRanges(data: PriceItem[], item: CurrencyItem, unitType: number) {
    const periods = [30, 60, 90, 180];

    const results = periods.map((days) => {
      const items = filterByDays(data, days);
      const analysis = analyzeRange(items, item, this.requestClass?.mainData?.current!, unitType);

      return {
        days,
        ...analysis,
      };
    });
    console.log(results)
    this.ranges.set(results);
  }
}
