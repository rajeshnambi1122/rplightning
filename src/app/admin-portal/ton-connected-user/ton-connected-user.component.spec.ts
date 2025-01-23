import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TonConnectedUserComponent } from './ton-connected-user.component';

describe('TonConnectedUserComponent', () => {
  let component: TonConnectedUserComponent;
  let fixture: ComponentFixture<TonConnectedUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TonConnectedUserComponent]
    });
    fixture = TestBed.createComponent(TonConnectedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
