import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {MdTableModule,MdPaginatorModule,MdProgressSpinnerModule} from '@angular/material';
import { ClientService } from '../../services/clients/client.service';
import { RequestService } from '../../services/requests/request.service';
import { NgbDateStruct,NgbTimeStruct,NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  
  loading:boolean =true;

  clients:{
    username:string,
    password:string,
    phone:number
  }
  clientName:string;
  
  requests:[{
    "_id":number,
    "actype":string,
    "capacity":string,
    "reqtype":string,
    "date":string,
    "clientid":string,
    "reqdesc":string,
    "createdate":string,
    "status":string,
    "assignedto":string,
    "address":{
      "geometry":{
        "type":string,
        "coordinates":{
          "lat":number,
          "lng":number
        }
      }
    },
    "location":string
  }
  ];

  constructor(private clientservice:ClientService,private model:NgbModal,private requestService:RequestService) { }

  ngOnInit() {
    this.clientservice.getClients().subscribe((clients)=>{
       this.loading = false;
       this.clients  = clients;
       console.log(this.clients);
    });

    
  }

  openRequests(clientUsername,openAllRequests){
    
    this.clientName = clientUsername;
    this.requestService.getAllRequests('Active',clientUsername).subscribe((allRequests)=>{
      this.requests = allRequests;
      this.model.open(openAllRequests).result.then((result)=>{
        console.log("done");
      },(reason)=>
    {

    })
    });
  }

}
