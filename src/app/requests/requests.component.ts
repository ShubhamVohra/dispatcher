import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/requests/request.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  state:string;
  size:number;
  requests:[{
    actype:string,
    capacity:string,
    reqtype:string,
    date:string,
    clientid:string,
    reqdesc:string,
    createdate:string,
    status:string,
    address:{
      geometry:{
        type:string,
        coordinates:{
          lat:number,
          lng:number
        }
      }
    },
    location:string
  }
  ];
  constructor(private requestservice:RequestService) { }

  ngOnInit() {
      this.state = null;
      this.requestservice.getRequests(this.state).subscribe((requests)=>{
      this.requests = requests; 
      this.size = this.requests.length;
    });
  }

}
