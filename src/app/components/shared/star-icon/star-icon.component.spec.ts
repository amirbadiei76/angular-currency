import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarIconComponent } from './star-icon.component';

describe('StartIconComponent', () => {
  let component: StarIconComponent;
  let fixture: ComponentFixture<StarIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
