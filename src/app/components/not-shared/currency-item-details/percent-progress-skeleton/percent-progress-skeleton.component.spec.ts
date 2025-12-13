import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentProgressSkeletonComponent } from './percent-progress-skeleton.component';

describe('PercentProgressSkeletonComponent', () => {
  let component: PercentProgressSkeletonComponent;
  let fixture: ComponentFixture<PercentProgressSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercentProgressSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PercentProgressSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
