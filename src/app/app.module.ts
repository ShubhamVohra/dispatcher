import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClientService } from '../services/clients/client.service';
import { RequestService } from '../services/requests/request.service'; 
import { routes } from './app.router';
import {MdListModule,MdIconModule,MdButtonModule,
        MdTableModule,MdPaginatorModule,MdDialogModule
        } from '@angular/material';
import { GeocodeService } from '../services/geocoder/geocode.service';
import { RequestsComponent } from './requests/requests.component';
import { ClientsComponent } from './clients/clients.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdListModule,
    MdIconModule,
    MdButtonModule,
    MdTableModule,
    MdPaginatorModule,
    CdkTableModule,
    BrowserAnimationsModule,
    routes,
    MdDialogModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    RequestsComponent,
    ClientsComponent
  ],
  providers: [
    ClientService,
    RequestService,
    GeocodeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
