import { Component } from '@angular/core';
import { StarIconComponent } from '../../../shared/star-icon/star-icon.component';

@Component({
  selector: 'empty-item',
  imports: [StarIconComponent],
  templateUrl: './empty-item.component.html',
  styleUrl: './empty-item.component.css'
})
export class EmptyItemComponent {

}
