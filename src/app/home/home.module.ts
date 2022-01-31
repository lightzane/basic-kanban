import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { MatMenuModule } from '@angular/material/menu';
import { FileImportConfirmComponent } from './components/dialogs/file-import-confirm/file-import-confirm.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HomeComponent,
    FileImportConfirmComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CdkAccordionModule,
    MatMenuModule,
    MatDialogModule
  ]
})
export class HomeModule { }
