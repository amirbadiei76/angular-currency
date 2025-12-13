import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemInfoSkeletonComponent } from './item-info-skeleton.component';

describe('ItemInfoSkeletonComponent', () => {
  let component: ItemInfoSkeletonComponent;
  let fixture: ComponentFixture<ItemInfoSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemInfoSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemInfoSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
