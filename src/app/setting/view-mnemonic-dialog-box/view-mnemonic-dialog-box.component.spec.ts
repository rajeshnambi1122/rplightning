import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMnemonicDialogBoxComponent } from './view-mnemonic-dialog-box.component';

describe('ViewMnemonicDialogBoxComponent', () => {
  let component: ViewMnemonicDialogBoxComponent;
  let fixture: ComponentFixture<ViewMnemonicDialogBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMnemonicDialogBoxComponent]
    });
    fixture = TestBed.createComponent(ViewMnemonicDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
