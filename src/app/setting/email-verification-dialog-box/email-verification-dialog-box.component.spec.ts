import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationDialogBoxComponent } from './email-verification-dialog-box.component';

describe('EmailVerificationDialogBoxComponent', () => {
  let component: EmailVerificationDialogBoxComponent;
  let fixture: ComponentFixture<EmailVerificationDialogBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailVerificationDialogBoxComponent]
    });
    fixture = TestBed.createComponent(EmailVerificationDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
