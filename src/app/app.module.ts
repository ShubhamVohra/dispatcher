import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClientService } from '../services/clients/client.service';
import { RequestService } from '../services/requests/request.service'; 
import {MdListModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdListModule
  ],
  providers: [
    ClientService,
    RequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
