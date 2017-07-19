import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RequestsComponent } from './requests/requests.component';
import { ClientsComponent } from './clients/clients.component';

export const router: Routes=[
    { path:'', redirectTo: 'home', pathMatch: 'full' },
    { path:'home', component:HomeComponent },
    { path:'clients', component:ClientsComponent },
    { path:'requests', component:RequestsComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);