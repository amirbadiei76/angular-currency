import { AfterViewInit, Component, effect, ElementRef, input, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import { createChart, IChartApi, ISeriesApi, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries, LineSeries, LineStyle } from 'lightweight-charts'
import { CommonModule } from '@angular/common';
import { CandleData, RawData, VolumeData } from '../../../../interfaces/chart.types';
import { CurrencyItem } from '../../../../interfaces/data.types';
import { dollar_unit, toman_unit } from '../../../../constants/Values';
import { commafy, dollarToToman, normalizeValue, poundToDollar, poundToToman, rialToDollar, rialToToman } from '../../../../utils/CurrencyConverter';
import { RequestArrayService } from '../../../../services/request-array.service';


@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() historyData?: RawData[];
  @Input() item?: CurrencyItem;
  chartType = input(0)
  currentUnit = input(0)

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private chart: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<"Candlestick"> | null = null;
  private volumeSeries: ISeriesApi<"Histogram"> | null = null;
  private lineSeries: ISeriesApi<'Line'> | null = null;

  
  currentPrice = signal<string>('');
  priceChange = signal<string>('');

  close = signal<string>('');
  low = signal<string>('');
  high = signal<string>('');
  open = signal<string>('');
  isPositive = signal<boolean>(true);
 
  
  timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];
  activeTimeframe = signal<string>('1D');

  private persianMonths = [
    "ژانویه",
    "فوریه",
    "مارس",
    "آوریل",
    "مه",
    "ژوئن",
    "ژوئیه",
    "اوت",
    "سپتامبر",
    "اکتبر",
    "نوامبر",
    "دسامبر"
  ];
  
  private upColor = 'rgba(48, 164, 108, 0.3)';
  private downColor = 'rgba(255, 66, 69, 0.3)';

  constructor(private requestService: RequestArrayService) {
    
    effect(() => {
      const processedData = this.parseData(this.historyData as RawData[]);

      this.currentUnit()
      this.candlestickSeries?.setData(processedData.candles as any[])
      this.volumeSeries?.setData(processedData.volumes as any[])

      const data2 = processedData.volumes.slice();
      data2.forEach((volume) => volume.color = '#00d890')
      this.lineSeries?.setData(data2 as any[]);
    })
  }

  ngOnChanges(): void {
    if (this.historyData && this.chart === null) {
      const processedData = this.parseData(this.historyData as RawData[]);
      console.log(this.chartType(), this.currentUnit())
      this.initChart(processedData);
      this.lineSeries?.applyOptions({ visible: false })
    }
    else {
      this.candlestickSeries?.applyOptions({ visible: this.chartType() === 0 })
      this.volumeSeries?.applyOptions({ visible: this.chartType() === 0 })
      this.lineSeries?.applyOptions({ visible: this.chartType() === 1 })
    }
  }

  // filterByDays (data: RawData[]) {
  //   const now = new Date().getTime();
  //   let days = 1;
  //   if (this.activeTimeframe() === '1D') return data;
  //   else if (this.activeTimeframe() === '1W') days = 7;
  //   else if (this.activeTimeframe() === '1M') days = 30;
  //   else if (this.activeTimeframe() === '3M') days = 90;
  //   else if (this.activeTimeframe() === '6M') days = 180;
  //   else if (this.activeTimeframe() === '1Y') days = 365;
    
  //   const limit = now - days * 24 * 60 * 60 * 1000;
  //   return data.filter((i) => new Date(i.ts).getTime() >= limit);
  // }

  parseData(rawData: RawData[]): { candles: CandleData[], volumes: VolumeData[], lineVolumes: VolumeData[] } {
    const sortedData = rawData?.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
    // const filteredData = this.filterByDays(sortedData);


    const uniqueMap = new Map();
    sortedData?.forEach(item => {
      const dateKey = item.ts.split(' ')[0];
      uniqueMap.set(dateKey, item);
    });
    const uniqueData = Array.from(uniqueMap.values()) as RawData[];

    const candles: CandleData[] = [];
    const volumes: VolumeData[] = [];
    const lineVolumes: VolumeData[] = [];

    for (let i = 0; i < uniqueData.length; i++) {
      const current = uniqueData[i];
      const prev = i > 0 ? candles[i - 1] : null;


      if (this.item?.faGroupName !== 'بازارهای ارزی') {
        if (this.currentUnit() === 0) {
          if (this.item?.unit === toman_unit) {
            const close = rialToToman(current.p);
            const high = rialToToman(current.h);
            const low = rialToToman(current.l);
           
            const open = prev ? prev.close : low;
      
            const time = new Date(current.ts).getTime() / 1000;
      
            candles.push({ time, open, high, low, close });
      
            const isUp = close >= open;

            const volume = normalizeValue(high, low, open, close)

            volumes.push({
              time,
              value: volume,
              color: isUp ? this.upColor : this.downColor,
            });
            
            lineVolumes.push({
              time,
              value: close,
              color: '#00d890',
            });
          }
          else if (this.item?.unit === dollar_unit) {
            const close = dollarToToman(current.p, this.requestService.mainData?.current!);
            const high = dollarToToman(current.h, this.requestService.mainData?.current!);
            const low = dollarToToman(current.l, this.requestService.mainData?.current!);
           
            const open = prev ? prev.close : low;
      
            const time = new Date(current.ts).getTime() / 1000;
      
            candles.push({ time, open, high, low, close });
      
            const isUp = close >= open;
            const volume = normalizeValue(high, low, open, close)
           
            volumes.push({
              time,
              value: volume,
              color: isUp ? this.upColor : this.downColor,
            });
            lineVolumes.push({
              time,
              value: close,
              color: '#00d890',
            });
          }
          else {
            const close = poundToToman(current.p, this.requestService.mainData?.current!);
            const high = poundToToman(current.h, this.requestService.mainData?.current!);
            const low = poundToToman(current.l, this.requestService.mainData?.current!);
           
            const open = prev ? prev.close : low;
      
            const time = new Date(current.ts).getTime() / 1000;
      
            candles.push({ time, open, high, low, close });
      
            const isUp = close >= open;
            const volume = normalizeValue(high, low, open, close)
           
            volumes.push({
              time,
              value: volume,
              color: isUp ? this.upColor : this.downColor,
            });
            lineVolumes.push({
              time,
              value: close,
              color: '#00d890',
            });
          }
        }
        else {
          if (this.item?.unit === toman_unit) {
            const close = rialToDollar(current.p, this.requestService.mainData?.current!);
            const high = rialToDollar(current.h, this.requestService.mainData?.current!);
            const low = rialToDollar(current.l, this.requestService.mainData?.current!);
           
            const open = prev ? prev.close : low;
      
            const time = new Date(current.ts).getTime() / 1000;
      
            candles.push({ time, open, high, low, close });
      
            const isUp = close >= open;
            const volume = normalizeValue(high, low, open, close)
           
            volumes.push({
              time,
              value: volume,
              color: isUp ? this.upColor : this.downColor,
            });
            lineVolumes.push({
              time,
              value: close,
              color: '#00d890',
            });
          }
          else if (this.item?.unit === dollar_unit) {
            const close = parseFloat(current.p.replace(/,/g, ''));
            const high = parseFloat(current.h.replace(/,/g, ''));
            const low = parseFloat(current.l.replace(/,/g, ''));
           
            const open = prev ? prev.close : low;
      
            const time = new Date(current.ts).getTime() / 1000;
      
            candles.push({ time, open, high, low, close });
            const isUp = close >= open;
            const volume = normalizeValue(high, low, open, close)
           
            volumes.push({
              time,
              value: volume,
              color: isUp ? this.upColor : this.downColor,
            });
            lineVolumes.push({
              time,
              value: close,
              color: '#00d890',
            });
          }
          else {
            const close = poundToDollar(current.p, this.requestService.mainData?.current!);
            const high = poundToDollar(current.h, this.requestService.mainData?.current!);
            const low = poundToDollar(current.l, this.requestService.mainData?.current!);
           
            const open = prev ? prev.close : low;
      
            const time = new Date(current.ts).getTime() / 1000;
      
            candles.push({ time, open, high, low, close });
      
            const isUp = close >= open;
            const volume = normalizeValue(high, low, open, close)
           
            volumes.push({
              time,
              value: volume,
              color: isUp ? this.upColor : this.downColor,
            });
            lineVolumes.push({
              time,
              value: close,
              color: '#00d890',
            });
          }
        }
      }
      else {
        const close = parseFloat(current.p.replace(/,/g, ''));
        const high = parseFloat(current.h.replace(/,/g, ''));
        const low = parseFloat(current.l.replace(/,/g, ''));
       
        const open = prev ? prev.close : low;
  
        const time = new Date(current.ts).getTime() / 1000;
  
        candles.push({ time, open, high, low, close });
        const isUp = close >= open;
        const volume = normalizeValue(high, low, open, close)
       
        volumes.push({
          time,
          value: volume,
          color: isUp ? this.upColor : this.downColor,
        });
        
        lineVolumes.push({
          time,
          value: close,
          color: '#00d890',
        });
      }
    }

    return { candles, volumes, lineVolumes };
  }

  initChart(data: { candles: any[], volumes: any[], lineVolumes: any[] }) {
    if (!this.chartContainer) return;
    
    this.chart = createChart(this.chartContainer.nativeElement, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#888',
        fontFamily: 'IranYekan'
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.3)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.3)' },
      },
      rightPriceScale: {
        borderColor: '#888',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.2)',
        timeVisible: true,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);

          const year = date.getFullYear();
          const month = this.persianMonths[date.getMonth()];
          const day = date.getDate();
          if (date.getMonth() === 0 && day === 1) return `${year}`;
          if (day === 1) return `${month}`
          return `${day}`;
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      width: this.chartContainer.nativeElement.clientWidth,
    });

    const timeScale = this.chart.timeScale();

    // تنظیمات کندل‌ها
    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#30a46c',
      downColor: '#ff4245',
      borderUpColor: '#30a46c',
      borderDownColor: '#ff4245',
      wickUpColor: '#30a46c',
      wickDownColor: '#ff4245',
    });
    this.candlestickSeries!.setData(data.candles);


    // تنظیمات حجم
    this.volumeSeries = this.chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    this.volumeSeries!.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });
    this.volumeSeries!.setData(data.volumes);


    this.lineSeries = this.chart.addSeries(LineSeries, {
      lineStyle: LineStyle.Solid,
      baseLineColor: '#00d890',
      priceLineColor: '#00d890',
      lineWidth: 2,
    });
    this.lineSeries.setData(data.lineVolumes);

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== this.chartContainer.nativeElement) { return; }
      const newRect = entries[0].contentRect;
      this.chart?.applyOptions({ width: newRect.width, height: newRect.height });
    });
    resizeObserver.observe(this.chartContainer.nativeElement);

    this.chart.subscribeCrosshairMove(param => {
      if (param.time) {
        const price = param.seriesData.get(this.candlestickSeries!) as any;
        if(price) {
          this.currentPrice.set(this.formatPrice(price.close));
          const change = ((price.close - price.open) / price.open) * 100;
          this.priceChange.set(`(${change >= 0 ? '+' : ''}${change.toFixed(2)})%`);
          this.high.set(commafy(price.high))
          this.low.set(commafy(price.low))
          this.open.set(commafy(price.open))
          this.close.set(commafy(price.close))
          this.isPositive.set(change >= 0);
        }
      }
    });

    // ست کردن مقدار اولیه
    if (data.candles.length > 0) {
        this.updateHeader(data.candles[data.candles.length - 1]);
    }
  }

  updateHeader(priceData: any) {
      this.currentPrice.set(this.formatPrice(priceData.close));
      const change = ((priceData.close - priceData.open) / priceData.open) * 100;
      this.priceChange.set(`(${change >= 0 ? '+' : ''}${change.toFixed(2)})%`);
      this.high.set(commafy(priceData.high))
      this.low.set(commafy(priceData.low))
      this.open.set(commafy(priceData.open))
      this.close.set(commafy(priceData.close))
      this.isPositive.set(change >= 0);
  }

  changeTimeframe(tf: string) {
    this.activeTimeframe.set(tf);
    if (this.activeTimeframe() === '1D') {
      
    }
    console.log(`Switched to ${tf}`);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US');
  }

  ngOnDestroy(): void {
    
  }
}
