import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RequestService {

  constructor(private http:Http) { }

  getRequests(status){
    return this.http.get('http://localhost:3000/getRequests/'+status).map(res=>res.json());
     //return this.http.get('http://demo.resthooks.org/api/v1/contacts/?api_key=7269a81cb207f88dbb9a405e58b23439d005d976').map(res=>res.json());
  }

  updateStartEnd(id:any,start,end,agentname){
    return this.http.get('http://localhost:3000/updateStartEnd/'+id + '/' + start + '/' +end + '/' +agentname).map(res=>res.json());
    
  }

  getAllRequests(state,clientid){
    return this.http.get('http://localhost:3000/getRequests/' + state +'/' + clientid).map(res=>res.json());
  }

}
