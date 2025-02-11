import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDialogComponent } from './send-dialog.component';

describe('SendDialogComponent', () => {
  let component: SendDialogComponent;
  let fixture: ComponentFixture<SendDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendDialogComponent]
    });
    fixture = TestBed.createComponent(SendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
