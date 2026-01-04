import { DestroyRef, Directive, ElementRef, HostListener, inject } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[commafyNumber]',
  standalone: true,
})
export class CommafyNumberDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  private isComposing = false;

  // ngOnInit() {
  //   fromEvent<InputEvent>(this.el.nativeElement, 'input')
  //     .subscribe(() => this.format());
  // }

  @HostListener('compositionstart')
  onCompositionStart() {
    this.isComposing = true;
  }

  @HostListener('compositionend')
  onCompositionEnd() {
    this.isComposing = false;
    this.format(); // format فقط بعد از commit
  }

  @HostListener('input')
  onInput() {
    if (this.isComposing) return;
    this.format();
  }

  private format() {
    const input = this.el.nativeElement;
    const cursor = input.selectionStart ?? 0;

    const normalized = this.normalizeDigits(input.value);
    const raw = normalized.replace(/\D+/g, '');

    if (!raw) {
      input.value = '';
      return;
    }

    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const diff = formatted.length - input.value.length;

    input.value = formatted;
    input.setSelectionRange(cursor + diff, cursor + diff);
  }

  private normalizeDigits(value: string): string {
    const persian = '۰۱۲۳۴۵۶۷۸۹';
    const arabic  = '٠١٢٣٤٥٦٧٨٩';

    return value.replace(/[۰-۹٠-٩]/g, d => {
      const p = persian.indexOf(d);
      if (p !== -1) return p.toString();

      const a = arabic.indexOf(d);
      if (a !== -1) return a.toString();

      return d;
    });
  }

  // private commafyFromRight(value: string): string {
  //   const reversed = value.split('').reverse().join('');
  //   const grouped = reversed.match(/.{1,3}/g)?.join(',') ?? '';
  //   return grouped.split('').reverse().join('');
  // }
  
  // private normalizeDigits(value: string): string {
  //   const persian = '۰۱۲۳۴۵۶۷۸۹';
  //   const arabic  = '٠١٢٣٤٥٦٧٨٩';

  //   return value.replace(/[۰-۹٠-٩]/g, d => {
  //     const p = persian.indexOf(d);
  //     if (p !== -1) return p.toString();

  //     const a = arabic.indexOf(d);
  //     if (a !== -1) return a.toString();

  //     return d;
  //   });
  // }

  // format() {
  //     const input = this.el.nativeElement;
  //     const cursor = input.selectionStart ?? 0;

  //     const normalized = this.normalizeDigits(input.value);
      
  //     const raw = normalized.replace(/\D+/g, '');

  //     if (!raw) {
  //       input.value = '';
  //       return;
  //     }

  //     const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  //     const diff = formatted.length - input.value.length;

  //     input.value = formatted;
  //     input.setSelectionRange(cursor + diff, cursor + diff);
  // }
}
