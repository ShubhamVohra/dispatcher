import { Component, OnInit,ElementRef,ViewChild  } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { ClientService } from '../../services/clients/client.service';
import { RequestService } from '../../services/requests/request.service';
import { GeocodeService } from '../../services/geocoder/geocode.service';
import { Observable } from 'rxjs/Observable';
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
  bounds = new google.maps.LatLngBounds();
  
  constructor(private clientservice:ClientService,private requestservice:RequestService, private geocodeService:GeocodeService) { }

  ngOnInit() {  
     var createRequest;
    
    this.clientservice.getClients().subscribe((clients)=>{
      console.log(clients);
    });
   
   
    this.requestservice.getRequests(this.state).subscribe((requests)=>{
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
     
  }
  
  getMessages() { 
    let observable = new Observable(observer => { 
      let socket = io('http://10.100.1.4:3000',{transports: ['websocket', 'polling', 'flashsocket']}); 
      socket.on('newrequest', (data) => { 
        observer.next(data); 
      }); 
      return () => { 
        socket.disconnect(); 
      }; 
    }) 
    return observable; 
  } 


  ngAfterViewInit() {
    console.log("afterinit");
   
    
  }


  initMap(){
    var latlng = new google.maps.LatLng(39.305, -76.617);
    

    
    this.map = new google.maps.Map(this.mapElement.nativeElement,{
      zoom:7,
      center:latlng
    });

    
    for(var i=0;i<this.requests.length;i++){
      
      
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
                   '<b>' + 'Date of Service : ' + '</b>' + request.date + '<br>' ;
      
      
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
      if(pos.lat() == posi.lat && pos.lng() == posi.lng){
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
          infoWindow.setContent('<div>' + marker.title + '<b>Address :</b>' +address + '</div>');
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
}
