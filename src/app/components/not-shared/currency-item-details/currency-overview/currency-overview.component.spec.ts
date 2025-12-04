import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyOverviewComponent } from './currency-overview.component';

describe('CurrencyOverviewComponent', () => {
  let component: CurrencyOverviewComponent;
  let fixture: ComponentFixture<CurrencyOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
