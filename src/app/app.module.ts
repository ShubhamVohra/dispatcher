import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClientService } from '../services/clients/client.service';
import { RequestService } from '../services/requests/request.service'; 
import {MdListModule,MdIconModule,MdButtonModule} from '@angular/material';
import { GeocodeService } from '../services/geocoder/geocode.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdListModule,
    MdIconModule,
    MdButtonModule
  ],
  providers: [
    ClientService,
    RequestService,
    GeocodeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
