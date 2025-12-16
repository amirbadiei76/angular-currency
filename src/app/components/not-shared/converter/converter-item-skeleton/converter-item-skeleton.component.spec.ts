import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterItemSkeletonComponent } from './converter-item-skeleton.component';

describe('ConverterItemSkeletonComponent', () => {
  let component: ConverterItemSkeletonComponent;
  let fixture: ComponentFixture<ConverterItemSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConverterItemSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterItemSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
