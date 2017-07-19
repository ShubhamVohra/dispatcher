import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {MdTableModule,MdPaginatorModule} from '@angular/material';
import { ClientService } from '../../services/clients/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  displayedColumns = ['userId', 'userName', 'status', 'dateofService'];

  clients:{
    username:string,
    password:string,
    phone:number
  }
  
  

  constructor(private clientservice:ClientService) { }

  ngOnInit() {
    this.clientservice.getClients().subscribe((clients)=>{
       this.clients  = clients;
       console.log(this.clients);
    });
  }

}
