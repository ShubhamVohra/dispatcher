import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClientService {

  constructor(private http:Http) { }

  getClients(){

    return this.http.get('http://localhost:3000/getClients').map(res=>res.json());
    
  }

  getAgents(){

    return this.http.get('http://localhost:3000/getAgents').map(res=>res.json());

  }

  getAssignedRequests(name,state){

    return this.http.get('http://localhost:3000/getAssignedRequests/' +state + '/' +name).map(res=>res.json());

  }

}
