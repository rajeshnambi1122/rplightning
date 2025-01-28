import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletMainPageComponent } from './wallet-main-page.component';

describe('WalletMainPageComponent', () => {
  let component: WalletMainPageComponent;
  let fixture: ComponentFixture<WalletMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletMainPageComponent]
    });
    fixture = TestBed.createComponent(WalletMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
