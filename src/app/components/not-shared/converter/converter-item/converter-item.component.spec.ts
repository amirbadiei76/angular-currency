import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterItemComponent } from './converter-item.component';

describe('ConverterItemComponent', () => {
  let component: ConverterItemComponent;
  let fixture: ComponentFixture<ConverterItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConverterItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
