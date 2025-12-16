import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[commafyNumber]',
  standalone: true,
})
export class CommafyNumberDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput() {
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
