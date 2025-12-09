import { AfterViewInit, Component, ElementRef, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import { createChart, IChartApi, ISeriesApi, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries } from 'lightweight-charts'
import { ChartService } from '../../../../services/chart.service';
import { CommonModule } from '@angular/common';
import { RawData } from '../../../../interfaces/chart.types';


@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() historyData?: RawData[];

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private chart: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<"Candlestick"> | null = null;
  private volumeSeries: ISeriesApi<"Histogram"> | null = null;

  
  currentPrice = signal<string>('---');
  priceChange = signal<string>('');
  isPositive = signal<boolean>(true);
 
  
  timeframes = ['1h', '4h', '1D', '1W'];
  activeTimeframe = signal<string>('1D');

  constructor(private dataService: ChartService) {}

  ngOnChanges(): void {
    if (this.historyData) {
      const processedData = this.dataService.parseData(this.historyData as RawData[]);
      this.initChart(processedData);
    }
  }

  initChart(data: { candles: any[], volumes: any[] }) {
    if (!this.chartContainer) return;

    this.chart = createChart(this.chartContainer.nativeElement, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#888',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.2)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.2)',
        timeVisible: true
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      width: this.chartContainer.nativeElement.clientWidth
    });

    const timeScale = this.chart.timeScale();

    // تنظیمات کندل‌ها
    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#00c853',
      downColor: '#ff5252',
      borderUpColor: '#00c853',
      borderDownColor: '#ff5252',
      wickUpColor: '#00c853',
      wickDownColor: '#ff5252',
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

    // ریسپانسیو بودن
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== this.chartContainer.nativeElement) { return; }
      const newRect = entries[0].contentRect;
      this.chart?.applyOptions({ width: newRect.width, height: newRect.height });
    });
    resizeObserver.observe(this.chartContainer.nativeElement);

    // آپدیت هدر هنگام حرکت موس
    this.chart.subscribeCrosshairMove(param => {
      if (param.time) {
        const price = param.seriesData.get(this.candlestickSeries!) as any;
        if(price) {
          this.currentPrice.set(this.formatPrice(price.close));
          const change = ((price.close - price.open) / price.open) * 100;
          this.priceChange.set(`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`);
          this.isPositive.set(change >= 0);
        }
      } else {
        // بازگشت به آخرین قیمت وقتی موس خارج می‌شود
        if (data.candles.length > 0) {
           const last = data.candles[data.candles.length - 1];
           this.updateHeader(last);
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
      this.priceChange.set(`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`);
      this.isPositive.set(change >= 0);
  }

  changeTimeframe(tf: string) {
    this.activeTimeframe.set(tf);
    // منطق تغییر دیتا از سرور در اینجا قرار می‌گیرد
    console.log(`Switched to ${tf}`);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US');
  }

  ngOnDestroy(): void {
    
  }
}
