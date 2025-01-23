import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPortalRoutingModule } from './admin-portal-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
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
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TonConnectedUserComponent } from './ton-connected-user/ton-connected-user.component';
import { TaskAdminComponent } from './task-admin/task-admin.component';
@NgModule({
  declarations: [
    UserDetailsComponent,
    TaskAdminComponent,
    TonConnectedUserComponent
  ],
  imports: [
    CommonModule,
    AdminPortalRoutingModule,
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
    // HttpClientModule,
    MatDialogModule,
    // MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
  ]
})

export class AdminPortalModule { }
