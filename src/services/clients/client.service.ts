import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClientService {

  constructor(private http:Http) { }

  getClients(){
    return this.http.get('http://10.100.1.4:3000/getClients').map(res=>res.json());
  }

}
