import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldCalculatorComponent } from './gold-calculator.component';

describe('GoldCalculatorComponent', () => {
  let component: GoldCalculatorComponent;
  let fixture: ComponentFixture<GoldCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
