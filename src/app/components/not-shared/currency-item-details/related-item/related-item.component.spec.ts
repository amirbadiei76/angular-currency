import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedItemComponent } from './related-item.component';

describe('RelatedItemComponent', () => {
  let component: RelatedItemComponent;
  let fixture: ComponentFixture<RelatedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
