import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RequestService {

  constructor(private http:Http) { }

  getRequests(status){
    return this.http.get('http://localhost:3000/getRequests/'+status).map(res=>res.json());
  }

}
