import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundBoxComponent } from './not-found-box.component';

describe('NotFoundBoxComponent', () => {
  let component: NotFoundBoxComponent;
  let fixture: ComponentFixture<NotFoundBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
