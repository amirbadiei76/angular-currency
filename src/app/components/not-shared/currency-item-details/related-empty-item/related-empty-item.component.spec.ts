import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedEmptyItemComponent } from './related-empty-item.component';

describe('RelatedEmptyItemComponent', () => {
  let component: RelatedEmptyItemComponent;
  let fixture: ComponentFixture<RelatedEmptyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedEmptyItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedEmptyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
