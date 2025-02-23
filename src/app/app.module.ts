import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BottomNavbarComponent } from './bottom-navbar/bottom-navbar.component';
import { MineComponent } from './mine/mine.component';
import { TaskComponent } from './task/task.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { FriendsComponent } from './friends/friends.component';
import { WalletComponent } from './wallet/wallet.component';
import { AboutComponent } from './about/about.component';
import { RewardDialogComponent } from './task/reward-dialog/reward-dialog.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatPaginatorModule,
  PageEvent,
  MatPaginator,
} from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { AdminLoginPageComponent } from './admin-login-page/admin-login-page.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { WalletMainPageComponent } from './wallet-main-page/wallet-main-page.component';
import { SettingComponent } from './setting/setting.component';
import { ViewMnemonicDialogBoxComponent } from './setting/view-mnemonic-dialog-box/view-mnemonic-dialog-box.component';
import { WheelFortuneComponent } from './wheel-fortune/wheel-fortune.component';
import { HonorScoreDialogBoxComponent } from './setting/honor-score-dialog-box/honor-score-dialog-box.component';
import { SendDialogComponent } from './setting/send-dialog/send-dialog.component';
import { EmailVerificationDialogBoxComponent } from './setting/email-verification-dialog-box/email-verification-dialog-box.component';
import { CommonModule } from '@angular/common';
import { DiamondPurchaseComponent } from './diamond-purchase/diamond-purchase.component';

@NgModule({
  declarations: [
    AppComponent,
    BottomNavbarComponent,
    MineComponent,
    TaskComponent,
    UpgradeComponent,
    FriendsComponent,
    WalletComponent,
    AboutComponent,
    RewardDialogComponent,
    AdminPortalComponent,
    AdminLoginPageComponent,
    WalletMainPageComponent,
    SettingComponent,
    ViewMnemonicDialogBoxComponent,
    WheelFortuneComponent,
    HonorScoreDialogBoxComponent,
    SendDialogComponent,
    EmailVerificationDialogBoxComponent,
    DiamondPurchaseComponent,
  ],
  imports: [
    BrowserModule,
    MatTreeModule,
    MatButtonModule,
    MatSnackBarModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatBottomSheetModule,
    HttpClientModule,
    MatTabsModule,
    MatDialogModule,
    MatSidenavModule,
    MatStepperModule,
    MatInputModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatRadioModule,
    MatCheckboxModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSortModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    RouterModule,
    CommonModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AdminLoginPageComponent,
    AdminPortalComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
