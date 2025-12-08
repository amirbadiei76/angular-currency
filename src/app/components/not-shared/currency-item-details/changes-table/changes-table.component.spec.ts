import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesTableComponent } from './changes-table.component';

describe('ChangesTableComponent', () => {
  let component: ChangesTableComponent;
  let fixture: ComponentFixture<ChangesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
