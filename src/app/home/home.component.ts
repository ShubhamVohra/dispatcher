import { Component, OnInit,ElementRef,ViewChild  } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { ClientService } from '../../services/clients/client.service';
import { RequestService } from '../../services/requests/request.service';
import { GeocodeService } from '../../services/geocoder/geocode.service';
import { Observable } from 'rxjs/Observable';
import { NgbDateStruct,NgbTimeStruct,NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as io from "socket.io-client";


declare var google:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  
  lat: number;
  lng: number;
  map:any;
 
  state:string= 'Active';
  markers = [];
  address:string;
  lastOpenedInfoWindow:any;
  agentPosition:any;
  loading:boolean = true;
  requestDescription:string;
  requestStatus:string;
  requestDateOfService:string;
  requestCreateDate:Date;
  clientName:string;
  requestAddress:string;
  agentName:string;
  agentUsername:string;
  agentRequests=[];
  count:number =0;

  marker:{
    "position":{
      lat:number,
      lng:number
    },
    "zoom":number,
    "map":any,
    "draggable":boolean,
    "title":string
  }
  agentMarkers= [];

  requests:[{
    "actype":string,
    "capacity":string,
    "reqtype":string,
    "date":string,
    "clientid":string,
    "reqdesc":string,
    "createdate":string,
    "status":string,
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
  }];

  agents:[{
    "_id":number,
    "name":string,
    "username":string,
    "password":string,
    "phone":number,
    "company_id":string,
  }];

  bounds = new google.maps.LatLngBounds();
  
  constructor(private clientservice:ClientService,private requestservice:RequestService,
              private geocodeService:GeocodeService,private model:NgbModal) { }

  ngOnInit() {  
     var createRequest;
     var updateAgentLocation;
    
    this.clientservice.getClients().subscribe((clients)=>{
      /* Getting all the clients for the first time to show them on the left 
         position of the window
         */
    });
    
    this.clientservice.getAgents().subscribe((agents)=>{
      /* Getting all the agents for the first time to show them on the left 
         position of the window  */
      this.agents = agents;
    });
   
    this.requestservice.getRequests(this.state).subscribe((requests)=>{
        this.loading = false;
        this.requests = requests;
        this.initMap();
        console.log(this.requests.length);
    });

    createRequest = this.getMessages().subscribe((message) => {
        console.log("Phle"+this.requests);
        let request:any = message;
        this.requests.push(request); 
        this.initMap();
    });

    
     updateAgentLocation = this.getAgentLocation().subscribe((location)=>{

         
        var self = this;
        let infoWindow = new google.maps.InfoWindow();
        this.agentPosition = location;
        console.log(this.agentMarkers);
        if(this.agentMarkers.length >0){
          
          var i=0;
          for (var marker  in this.agentMarkers) {

              var diff = (new Date().getTime() - this.agentMarkers[marker].time.getTime())/1000;

             
              if(this.agentPosition.sa ==  this.agentMarkers[marker].title){

                  var latlng = new google.maps.LatLng(this.agentPosition.lat,this.agentPosition.lng);
                  this.agentMarkers[marker].setPosition(latlng);
                  i=1;
                  //infoWindow.open(this.map,this.agentMarkers[marker]);
                  this.agentMarkers[marker].time = new Date();
                  console.log(this.agentMarkers[marker].time);
                  if(this.agentMarkers[marker].icon == "../assets/images/image_grey.jpg"){
                    this.agentMarkers[marker].icon = "../assets/images/image.jpg";    
                  }
              }

              if(diff>300){
                this.agentMarkers[marker].icon = "../assets/images/image_grey.jpg";
              }
              
          }
          if(i==0){
            
            let marker = new google.maps.Marker({
              'icon':"../assets/images/image.jpg",
              'animation': google.maps.Animation.DROP,
              'position':{'lat':this.agentPosition.lat,'lng':this.agentPosition.lng},
              'zoom':15,
              'map':this.map,
              'draggable':false,
              'title':this.agentPosition.sa,
              'time':new Date()
            });
            this.agentMarkers.push(marker);
            var latlng = new google.maps.LatLng(this.agentPosition.lat,this.agentPosition.lng);

            infoWindow.setOptions({
                    'position':latlng,
                    'content':'<b>' + this.agentPosition.name
              });

            infoWindow.open(this.map,marker);
            
          }
          
        }
        else{
          
          let marker = new google.maps.Marker({
            'icon':"../assets/images/image.jpg",
            'animation': google.maps.Animation.DROP,
            'position':{'lat':this.agentPosition.lat,'lng':this.agentPosition.lng},
            'zoom':15,
            'map':this.map,
            'draggable':false,
            'title':this.agentPosition.sa,
            'time':new Date()
          });

          var latlng = new google.maps.LatLng(this.agentPosition.lat,this.agentPosition.lng);
          
          infoWindow.setOptions({
                    'position':latlng,
                    'content':'<b>' + this.agentPosition.name
              });
          // this.marker.position.lat = this.agentPosition.lat;
          // this.marker.position.lng = this.agentPosition.lng;
          // this.marker.draggable = false;
          // this.marker.map = this.map;
          // this.marker.title = this.agentPosition.sa;
         
          this.agentMarkers.push(marker);
          infoWindow.open(this.map,marker);
          
        }
      });

  }

 
  
  getMessages() { 
    let observable = new Observable(observer => { 
      let socket = io('http://54.174.46.232:3000',{transports: ['websocket', 'polling', 'flashsocket']}); 
      socket.on('newrequest', (data) => { 
        observer.next(data); 
        
      }); 
      return () => { 
        socket.disconnect(); 
      }; 
    }); 
    return observable; 
  }

  createNewMarker(agentPosition){
    let marker = new google.maps.Marker({
        'position':{'lat':this.agentPosition.lat,'lng':this.agentPosition.lng},
        'zoom':15,
        'map':this.map,
        'draggable':false
    });
    console.log(this.agentPosition);
  }
  
  getAgentLocation(){
    let observe = new Observable((observer)=>{
      let socket = io('http://54.174.46.232:3000',{transports:['websocket','polling','flashsocket']});
      socket.on('agentlocation',(data)=>{
       
        observer.next(data);
        
      })
      return ()=>{
        socket.disconnect();
      }
    });
    return observe;
  }


  ngAfterViewInit() {
    console.log("afterinit"); 
    
  }


  initMap(){
    var latlng = new google.maps.LatLng(39.305, -76.617);
    this.map = new google.maps.Map(this.mapElement.nativeElement,{
      "zoom":7,
      "center":latlng,
      "clickableIcons":false,
      "disableDefaultUI": true
    });

    
    for(var i=0;i<this.requests.length;i++){
      
      this.geocodeService.addressForlatLng(this.requests[i].address.geometry.coordinates.lat,this.requests[i].address.geometry.coordinates.lng)
        .subscribe((address: string) => {
         this.requests[i].location = address;
          
        }, (error) => {
          //alert(error);
          console.log("fdwqd");
          console.error(error);
      });
      
      this.addmarker(this.requests[i])
      // google.maps.event.addListener(marker, 'click', function() {
      
      //    this.infowindow.open(this.map, marker);
      // });

      this.map.fitBounds(this.bounds);
    }
  }

  infoshow(request){

    console.log(request);
    this.addmarker(request);
    
  }

  addmarker(request){
      var lat = request.address.geometry.coordinates.lat;
      var lng = request.address.geometry.coordinates.lng;
      let geocoder = new google.maps.Geocoder;
      var  title = '<b>' + 'Client Name : ' + '</b>' + request.clientid + '<br>' +
                   '<b>' + 'Service Type : ' + '</b>' + request.reqtype + '<br>' +
                   '<b>' + 'Service Status : ' + '</b>' + request.status + '<br>' +
                   '<b>' + 'Date of Service : ' + '</b>' + request.date + '<br>' + 
                   '<b>' + 'Date of Service : ' + '</b>' + request.location + '<br>' ;
      
      
      let infoWindow = new google.maps.InfoWindow();

      let marker = new google.maps.Marker({
        'position':{'lat':lat,'lng':lng},
        'zoom':15,
        'map':this.map,
        'draggable':false,
        'title':title
      });

     
      this.markers.push(marker);
      this.bounds.extend(marker.position);

      marker.addListener('click',()=>{
        this.populateInfoWindow(marker,infoWindow);
      }); 
      
  }

  openMarker(request){
    
    for(var j=0; j<this.markers.length;j++){
      let infoWindow = new google.maps.InfoWindow();
      var pos = this.markers[j].getPosition();
      var posi = request.address.geometry.coordinates;
      console.log(pos.lng(),posi.lng);
      if((pos.lat().toFixed(4) == posi.lat.toFixed(4)) && (pos.lng().toFixed(4) == posi.lng.toFixed(4))){
        
        this.populateInfoWindow(this.markers[j],infoWindow);
      }
    }
      
      

  }

  populateInfoWindow(marker,infoWindow){
    console.log("Title of the marker "+marker.title);
    if(infoWindow.marker!=marker){
      
      infoWindow.marker = marker;
      let point = marker.getPosition()
      this.geocodeService.addressForlatLng(point.lat(),point.lng())
        .subscribe((address: string) => {
         
          this.closeLastOpenedInfoWindo();
          infoWindow.setContent('<div>' + marker.title + '</div>');
          infoWindow.open(this.map,marker);
          this.lastOpenedInfoWindow = infoWindow;
        }, (error) => {
          //alert(error);
          console.error(error);
      });
    }
  }

  closeLastOpenedInfoWindo() {
    if (this.lastOpenedInfoWindow) {
        this.lastOpenedInfoWindow.close();
    }
  }

  openRequestDetails(request,requestDetails){
    this.requestStatus = request.status;
    this.clientName = request.clientid;
    this.requestCreateDate = request.createdate;
    this.requestDescription = request.reqdesc;
    this.requestDateOfService = request.date;
    this.geocodeService.addressForlatLng(request.address.geometry.coordinates.lat,request.address.geometry.coordinates.lng)
        .subscribe((address: string) => {
         this.requestAddress = address;
          
        }, (error) => {
          //alert(error);
          console.error(error);
      });
    this.model.open(requestDetails).result.then((result)=>{

    },
    (reason)=>{

    });
  }

  openAgentRequests(agent,agentAssignedRequests){
    this.agentRequests = [];
    this.agentName = agent.name;
    this.agentUsername = agent.username;
    this.clientservice.getAssignedRequests(agent.username,"Active").subscribe((assgndRequests)=>{
      this.agentRequests = assgndRequests;
      this.model.open(agentAssignedRequests).result.then((result)=>{

      });
      
    });
    
  }

}
