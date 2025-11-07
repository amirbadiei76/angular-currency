import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyItemComponent } from './currency-item.component';

describe('CurrencyItemComponent', () => {
  let component: CurrencyItemComponent;
  let fixture: ComponentFixture<CurrencyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
