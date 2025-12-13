import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentProgressComponent } from './percent-progress.component';

describe('PercentProgressComponent', () => {
  let component: PercentProgressComponent;
  let fixture: ComponentFixture<PercentProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercentProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PercentProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
