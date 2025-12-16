import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') text = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltipEl?: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}


  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.tooltipEl) return;

    this.tooltipEl = this.renderer.createElement('span');
    this.renderer.appendChild(
      this.tooltipEl,
      this.renderer.createText(this.text)
    );

    this.renderer.appendChild(document.body, this.tooltipEl);
    this.applyBaseStyles();
    this.setPosition();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.destroyTooltip();
  }

  ngOnDestroy() {
    this.destroyTooltip();
  }

  private destroyTooltip() {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = undefined;
    }
  }

  private applyBaseStyles() {
    const classes = [
      'fixed',
      'z-[4]',
      'rtl',
      'px-3',
      'min-w-max',
      'py-1.5',
      'text-sm',
      'text-dark-text3',
      'dark:text-light-text3',
      'bg-light-border2',
      'dark:bg-dark-border2',
      'rounded-md',
      'shadow-lg',
      'pointer-events-none',
      'opacity-0',
      'transition-opacity',
      'duration-500'
    ];

    classes.forEach(c =>
      this.renderer.addClass(this.tooltipEl!, c)
    );
    requestAnimationFrame(() => {
      if (!this.tooltipEl) return;
      this.renderer.addClass(this.tooltipEl!, 'opacity-100');
    });

  }

  private setPosition() {
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipEl!.getBoundingClientRect();
    const gap = 4;

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top - tooltipRect.height - gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;

      case 'bottom':
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;

      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - gap;
        break;

      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + gap;
        break;
    }

    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
  }
}
