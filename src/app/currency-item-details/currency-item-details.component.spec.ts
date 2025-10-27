import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyItemDetailsComponent } from './currency-item-details.component';

describe('CurrencyItemDetailsComponent', () => {
  let component: CurrencyItemDetailsComponent;
  let fixture: ComponentFixture<CurrencyItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyItemDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
