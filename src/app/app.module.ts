import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SNACKBAR_CONFIG } from './shared/constants/snackbar-config';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { DIALOG_CONFIG } from './shared/constants/dialog-config';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HomeModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: SNACKBAR_CONFIG
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: DIALOG_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
