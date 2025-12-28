import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingShellComponent } from './loading-shell.component';

describe('LoadingShellComponent', () => {
  let component: LoadingShellComponent;
  let fixture: ComponentFixture<LoadingShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
