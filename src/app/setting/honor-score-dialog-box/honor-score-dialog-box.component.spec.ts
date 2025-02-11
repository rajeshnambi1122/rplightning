import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorScoreDialogBoxComponent } from './honor-score-dialog-box.component';

describe('HonorScoreDialogBoxComponent', () => {
  let component: HonorScoreDialogBoxComponent;
  let fixture: ComponentFixture<HonorScoreDialogBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HonorScoreDialogBoxComponent]
    });
    fixture = TestBed.createComponent(HonorScoreDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
