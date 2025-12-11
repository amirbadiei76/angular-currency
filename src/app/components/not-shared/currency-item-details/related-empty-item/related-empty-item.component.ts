import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-related-empty-item',
  imports: [],
  templateUrl: './related-empty-item.component.html',
  styleUrl: './related-empty-item.component.css'
})
export class RelatedEmptyItemComponent {
  @Input() index?: number = 1;
}
