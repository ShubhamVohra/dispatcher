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
  title: string = 'My first AGM project';
  lat: number;
  lng: number;
  map:any;
  state:string= 'Active';
  markers = [];

  requests:[{
    actype:string,
    capacity:string,
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
    }
  }
  ];
  
  
  constructor(private clientservice:ClientService,private requestservice:RequestService) { }

  ngOnInit() {  
    this.clientservice.getClients().subscribe((clients)=>{
      console.log(clients);
    });
    this.requestservice.getRequests(this.state).subscribe((requests)=>{
      this.requests = requests;
      
    });

  }
  ngAfterViewInit() {
    console.log("afterinit");
    setTimeout(() => {
      this.initMap();
    }, 1000);
  }
  initMap(){
    var latlng = new google.maps.LatLng(39.305, -76.617);
    this.map = new google.maps.Map(this.mapElement.nativeElement,{
      zoom:7,
      center:latlng
    });

    
    for(var i=0;i<this.requests.length;i++){

      var lat = this.requests[i].address.geometry.coordinates.lat;
      var lng = this.requests[i].address.geometry.coordinates.lng;

      var  title = this.requests[i].clientid;

      let marker = new google.maps.Marker({
        'position':{'lat':lat,'lng':lng},
        'zoom':15,
        'map':this.map,
        'draggable':true,
        'title':title
      });
      this.markers.push(marker);
      marker.addListener('click',()=>{
        infoWindow.open(this.map,marker);
      }); 
    }

    let infoWindow = new google.maps.InfoWindow({
      content:'<b>' + 'Shubham Vohra' + '</b>'
    });

    
  }
}
