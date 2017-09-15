import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClientService } from '../services/clients/client.service';
import { RequestService } from '../services/requests/request.service'; 
import { routes } from './app.router';

import {MdListModule,MdIconModule,MdButtonModule,MdProgressSpinnerModule,
        MdTableModule,MdPaginatorModule,MdDialogModule
        } from '@angular/material';
      
import { GeocodeService } from '../services/geocoder/geocode.service';
import { RequestsComponent } from './requests/requests.component';
import { ClientsComponent } from './clients/clients.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from './demo-utils/module';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SchedboardComponent } from './schedboard/schedboard.component';

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
    MdProgressSpinnerModule,
    BrowserAnimationsModule,
    routes,
    MdDialogModule,
    CalendarModule.forRoot(),
    NgbModalModule.forRoot(),
    DemoUtilsModule,
    DragAndDropModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    RequestsComponent,
    ClientsComponent,
    SchedboardComponent
  ],
  providers: [
    ClientService,
    RequestService,
    GeocodeService
  ],
  exports:[
    DemoUtilsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
