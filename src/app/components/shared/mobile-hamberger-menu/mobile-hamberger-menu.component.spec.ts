import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileHambergerMenuComponent } from './mobile-hamberger-menu.component';

describe('MobileHambergerMenuComponent', () => {
  let component: MobileHambergerMenuComponent;
  let fixture: ComponentFixture<MobileHambergerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileHambergerMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileHambergerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
