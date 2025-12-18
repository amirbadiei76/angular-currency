import { DestroyRef, Directive, ElementRef, HostListener, inject } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[commafyNumber]',
  standalone: true,
})
export class CommafyNumberDirective {
  private el = inject(ElementRef<HTMLInputElement>);

  ngOnInit() {
    fromEvent<InputEvent>(this.el.nativeElement, 'input')
      .subscribe(() => this.format());
  }

  private commafyFromRight(value: string): string {
    const reversed = value.split('').reverse().join('');
    const grouped = reversed.match(/.{1,3}/g)?.join(',') ?? '';
    return grouped.split('').reverse().join('');
  }
  

  format() {
    const input = this.el.nativeElement;
    const cursor = input.selectionStart ?? 0;

    let value = input.value.replace(/[^\d.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    const [integerPart, decimalPart] = value.split('.');

    const formattedInt = integerPart
      ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : '';

    const formattedValue =
      decimalPart !== undefined
        ? `${formattedInt}.${decimalPart}`
        : formattedInt;

    const diff = formattedValue.length - input.value.length;

    input.value = formattedValue;
    input.setSelectionRange(cursor + diff, cursor + diff);
  }
}
