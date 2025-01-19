import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardDialogComponent } from './reward-dialog.component';

describe('RewardDialogComponent', () => {
  let component: RewardDialogComponent;
  let fixture: ComponentFixture<RewardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RewardDialogComponent]
    });
    fixture = TestBed.createComponent(RewardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
