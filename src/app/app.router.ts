import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RequestsComponent } from './requests/requests.component';
import { ClientsComponent } from './clients/clients.component';
import {SchedboardComponent } from './schedboard/schedboard.component';

export const router: Routes=[
    { path:'', redirectTo: 'home', pathMatch: 'full' },
    { path:'home', component:HomeComponent },
    { path:'clients', component:ClientsComponent },
    { path:'requests', component:RequestsComponent },
    { path: 'schedboard', component:SchedboardComponent}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);