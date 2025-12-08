import { PriceItem } from "../components/not-shared/currency-item-details/changes-table/changes-table.component";
import { dollar_unit, toman_unit } from "../constants/Values";
import { CurrencyItem, Current } from "../interfaces/data.types";
import { commafy, dollarToToman, poundToDollar, poundToToman, rialToDollar, rialToToman } from "./CurrencyConverter";

export function filterByDays(data: PriceItem[], days: number) {
    const now = new Date().getTime();
    const limit = now - days * 24 * 60 * 60 * 1000;
    return data.filter((i) => i.date.getTime() >= limit);
}

export function analyzeRange(data: PriceItem[], item: CurrencyItem, current: Current, unit: number) {
    if (data.length < 2) return null;

    if (item.faGroupName !== 'بازارهای ارزی') {
        if (unit === 0) {
            if (item.unit === toman_unit) {
                const firstValue = rialToToman(data[0].p);
                const lastValue = rialToToman(data[data.length - 1].p);

                const change = lastValue - firstValue;
                const percent = (Math.abs(change / firstValue) * 100).toFixed(2);

                const avg = data.reduce((sum, item) => sum + rialToToman(item.p), 0) / data.length;

                const first = commafy(firstValue)
                const last = commafy(lastValue)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(Math.round(avg)),
                    direction: change >= 0 ? 'high' : 'low',
                };
            }
            else if (item.unit === dollar_unit) {
                const firstValue = dollarToToman(data[0].p, current);
                const lastValue = dollarToToman(data[data.length - 1].p, current);

                const change = lastValue - firstValue;
                const percent = (Math.abs(change / firstValue) * 100).toFixed(2);

                const avg = data.reduce((sum, item) => sum + dollarToToman(item.p, current), 0) / data.length;

                const first = commafy(firstValue)
                const last = commafy(lastValue)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(Math.round(avg)),
                    direction: change >= 0 ? 'high' : 'low',
                };
            }
            else {
                const firstValue = poundToToman(data[0].p, current);
                const lastValue = poundToToman(data[data.length - 1].p, current);

                const change = lastValue - firstValue;
                const percent = (Math.abs(change / firstValue) * 100).toFixed(2);

                const avg = data.reduce((sum, item) => sum + poundToToman(item.p, current), 0) / data.length;

                const first = commafy(firstValue)
                const last = commafy(lastValue)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(Math.round(avg)),
                    direction: change >= 0 ? 'high' : 'low',
                };
            }
        }
        else {
            if (item.unit === toman_unit) {
                const firstValue = rialToDollar(data[0].p, current);
                const lastValue = rialToDollar(data[data.length - 1].p, current);

                const change = lastValue - firstValue;
                const percent = (Math.abs(change / firstValue) * 100).toFixed(2);

                const avg = data.reduce((sum, item) => sum + rialToDollar(item.p, current), 0) / data.length;
                
                const first = commafy(firstValue)
                const last = commafy(lastValue)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(+avg.toFixed(2)),
                    direction: change >= 0 ? 'high' : 'low',
                };
            }
            else if (item.unit === dollar_unit) {
                const first = data[0].p;
                const last = data[data.length - 1].p;
              
                const change = Number(last.replaceAll(',', '')) - Number(first.replaceAll(',', ''));
                const percent = (Math.abs(change / Number(first.replaceAll(',', ''))) * 100).toFixed(2);
              
                const avg =
                  data.reduce((sum, item) => sum + Number(item.p.replaceAll(',', '')), 0) / data.length;
              
                return {
                  first,
                  last,
                  change,
                  percent,
                  avg: commafy(+avg.toFixed(2)),
                  direction: change >= 0 ? 'high' : 'low',
                };
            }
            else {
                const firstValue = poundToDollar(data[0].p, current);
                const lastValue = poundToDollar(data[data.length - 1].p, current);

                const change = lastValue - firstValue;
                const percent = (Math.abs(change / firstValue) * 100).toFixed(2);

                const avg = data.reduce((sum, item) => sum + poundToDollar(item.p, current), 0) / data.length;

                const first = commafy(firstValue)
                const last = commafy(lastValue)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(+avg.toFixed(2)),
                    direction: change >= 0 ? 'high' : 'low',
                };
            }
        }
    }
    const first = data[0].p;
    const last = data[data.length - 1].p;
  
    const change = Number(last.replaceAll(',', '')) - Number(first.replaceAll(',', ''));
    const percent = (Math.abs(change / Number(first.replaceAll(',', ''))) * 100).toFixed(2);
  
    const avg =
      data.reduce((sum, item) => sum + Number(item.p.replaceAll(',', '')), 0) / data.length;
  
    return {
      first,
      last,
      change,
      percent,
      avg: commafy(+avg.toFixed(2)),
      direction: change >= 0 ? 'high' : 'low',
    };
}
  