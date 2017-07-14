import { Component, OnInit,ElementRef,ViewChild  } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { ClientService } from '../../services/clients/client.service';
import { RequestService } from '../../services/requests/request.service';

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
  
  
  constructor(private clientservice:ClientService,private requestservice:RequestService) { }

  ngOnInit() {  
    this.clientservice.getClients().subscribe((clients)=>{
      console.log(clients);
    });

    this.requestservice.getRequests(this.state).subscribe((requests)=>{
      this.requests = requests;
      this.initMap(); 
      
      
    });
    

  }


  initMap(){
    var latlng = new google.maps.LatLng(39.305, -76.617);
    let bounds = new google.maps.LatLngBounds();

    
    this.map = new google.maps.Map(this.mapElement.nativeElement,{
      zoom:7,
      center:latlng
    });

    
    for(var i=0;i<this.requests.length;i++){
      
      var lat = this.requests[i].address.geometry.coordinates.lat;
      var lng = this.requests[i].address.geometry.coordinates.lng;
      let geocoder = new google.maps.Geocoder;
      
      var location=  geocoder.geocode({'location':{'lat':lat,'lng':lng}},function(results,status){
        if(results[1]){
           var address = results[1].formatted_address;
           console.log(address);
            return address;
        }
      });

     
      
      var  title = '<b>' + 'Client Name : ' + '</b>' + this.requests[i].clientid + '<br>' +
                   '<b>' + 'Service Type : ' + '</b>' + this.requests[i].reqtype + '<br>' +
                   '<b>' + 'Service Status : ' + '</b>' + this.requests[i].status + '<br>' +
                   '<b>' + 'Address : ' + '</b>' + console.log(location);
      
      
      let infoWindow = new google.maps.InfoWindow();

      let marker = new google.maps.Marker({
        'position':{'lat':lat,'lng':lng},
        'zoom':15,
        'map':this.map,
        'draggable':false,
        'title':title
      });

     
      this.markers.push(marker);
      bounds.extend(marker.position);

      marker.addListener('click',()=>{
        this.populateInfoWindow(marker,infoWindow);
      }); 

      google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(this.map, marker);
      });
      

      this.map.fitBounds(bounds);
    }

    

    
  }

  populateInfoWindow(marker,infoWindow){
    console.log("Title of the marker "+marker.title);
    if(infoWindow.marker!=marker){
      
      infoWindow.marker = marker;
      infoWindow.setContent('<div>' + marker.title + '</div>');
      infoWindow.open(this.map,marker);
    }
  }
}
