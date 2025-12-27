import { Component, computed, inject, input, Input, signal } from '@angular/core';
import { RawData } from '../../../../interfaces/chart.types';
import { analyzeRange, filterByDays } from '../../../../utils/CurrencyChanges';
import { CurrencyItem } from '../../../../interfaces/data.types';
import { RequestArrayService } from '../../../../services/request-array.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, map, shareReplay } from 'rxjs';

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
  // @Input() historyData?: RawData[];
  // @Input() item?: CurrencyItem;
  @Input({ required: true })
  set historyData(value: RawData[] | undefined) {
    this._historyData.set(value ?? []);
  }

  @Input({ required: true })
  set item(value: CurrencyItem | undefined) {
    this.currentItem.set(value);
  }

  private _historyData = signal<RawData[]>([]);
  currentItem = signal<CurrencyItem | undefined>(undefined);

  normalizeData = computed(() => {
    const data = this._historyData();
    if (!data.length) return [];

    return data.map((item: RawData) => ({
      ...item,
      date: new Date(item.ts)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  })

  currentUnit = input(0)

  // ranges = signal<ChangesResult[]>([])
  ranges = computed<ChangesResult[]>(() => {
    const data = this.normalizeData()
    const item = this.currentItem();
    const unit = this.currentUnit();
    const current = this.currentValue();

    if (!data.length || !item || current == null) return [];

    const periods = [30, 60, 90, 180];

    return periods.map(days => {
      const items = filterByDays(data, days);
      const analysis = analyzeRange(items, item, current, unit);

      return {
        days,
        ...analysis
      };
    });
  });


  requestClass = inject(RequestArrayService);

  currentValue = toSignal(from(this.requestClass.mainData!)
  .pipe(
    map((data) => data?.current),
    shareReplay(1)
  ))

  // calculateRanges(data: PriceItem[], item: CurrencyItem, unitType: number) {
  //   const periods = [30, 60, 90, 180];

  //   const results = periods.map((days) => {
  //     const items = filterByDays(data, days);
  //     const analysis = analyzeRange(items, item, this.currentValue()!, unitType);

  //     return {
  //       days,
  //       ...analysis,
  //     };
  //   });
  //   this.ranges.set(results);
  // }
}
