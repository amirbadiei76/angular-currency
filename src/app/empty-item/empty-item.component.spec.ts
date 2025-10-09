import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyItemComponent } from './empty-item.component';

describe('EmptyItemComponent', () => {
  let component: EmptyItemComponent;
  let fixture: ComponentFixture<EmptyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
