import { Component, OnInit,ChangeDetectionStrategy,NgZone  } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import {colors} from './colors';
import {getTime,addHours,addDays,isSameDay,isSameMonth,} from 'date-fns';
import { RequestService } from '../../services/requests/request.service';
import { ClientService } from '../../services/clients/client.service';
import { NgbDateStruct,NgbTimeStruct,NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'app-schedboard',
  templateUrl: './schedboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./schedboard.component.css','../../../node_modules/angular-calendar/dist/css/angular-calendar.css']
})

export class SchedboardComponent implements OnInit {

  view: string = 'month';
  viewDate: Date = new Date();
  state:string;
  size:number;
  isdefault:number=0;
  agentname:string;
  assignedagentname:string;
  agentusername:string;
  showDialog:boolean=false;
  modalTitle:string;
  modalContent:string;
  eventDetails:any;
  loading:boolean=true;
  allRequests:any;
  
  
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
    "start":Date,
    "end":Date,
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

  assignedrequests=[];

  agents:[{
    "_id":number,
    "name":string,
    "username":string,
    "password":string,
    "phone":number,
    "company_id":string,
  }];

  externalEvents:  CalendarEvent[]=[];
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;
  obj: any;
  
  refresh: Subject<any> = new Subject();

  constructor(private requestservice:RequestService,public zone:NgZone,private clientService:ClientService,
              public modal:NgbModal) { 
  }


  ngOnInit() {
      this.clientService.getAgents().subscribe((agents)=>{
        this.loading= false;
        this.agents= agents;
        // console.log(this.agents);
      })
  }



  ngAfterViewInit(){
    this.state = null;
      this.requestservice.getRequests(this.state).subscribe((requests)=>{
      this.requests = requests; 
      this.size = this.requests.length;
      for(var i=0;i<this.size;i++){
        
         if(this.requests[i].status == "Assigned"){
           this.obj = {
            title: this.requests[i].reqdesc,
            start:new Date(requests[i].start),
            color:colors.yellow,
            end:new Date(requests[i].end),
            draggable:true,
            resizable:{
              beforeStart:true,
              afterEnd:true
            },
            meta:{
              id:this.requests[i]._id
            }
          }
          this.events.push(this.obj);
          this.refresh.next();
         }
        else{
          this.obj = {
            title: this.requests[i].reqdesc,
            start:addDays(new Date(this.requests[i].date),1),
            color:colors.yellow,
            end:addDays(new Date(this.requests[i].date),1),
            draggable:true,
            resizable:{
              beforeStart:true,
              afterEnd:true
            },
            meta:{
              id:this.requests[i]._id
            }
          }
          this.externalEvents.push(this.obj);
          this.refresh.next();

        }
        
      }
    });
    
  }



  // eventTimesChanged({event,newStart,newEnd}: CalendarEventTimesChangedEvent): void {
  //   event.start = newStart;
  //   event.end = newEnd;
  //   this.refresh.next();
  // }

  eventDropped({event,newStart,newEnd}: CalendarEventTimesChangedEvent,requestdetails): void {

    const externalIndex: number = this.externalEvents.indexOf(event);
    
    event.start = newStart;
    event.draggable=false;
    if(this.isdefault ==0){
      this.modalTitle="Sorry !!";
      this.modalContent="You can't assign the job into default calendar.Click on the particular engineer to open his calendar and assign the job then.  "
      this.modal.open(requestdetails).result.then((result) => {
        console.log("Shubham");
      }, (reason) => {
        console.log("Vohra");
      });
    }
    else{
      this.modalTitle="Done!!";
      this.modalContent="The job " + event.title +  " has been assigned to " + this.agentname + ".";
      this.modal.open(requestdetails).result.then((result) => {
        console.log("Shubham");
      }, (reason) => {
        console.log("Vohra");
      }); 
       if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
      this.updateStartEnd(event,newStart,event.end,event.meta.id);
    }
    
    }
    if (newEnd) {
      event.end = newEnd;
      this.updateStartEnd(event,newStart,newEnd,event.meta.id);
    }
    this.viewDate = newStart;
    this.activeDayIsOpen = true;
    this.refresh.next();
  }

  updateStartEnd(event,start,end,id){
    this.requestservice.updateStartEnd(id,start,end,this.agentusername).subscribe((res)=>{
      // console.log(res);
    })
  }

  openCalendar(agent){
    this.isdefault=1;
    this.agentname = agent.name;  
    this.agentusername = agent.username;
    this.events= [];
    // this.modal.open(content).result.then((result) => {
    //   console.log("Shubham");
    // }, (reason) => {
    //   console.log("Vohra");
    // });;
    this.clientService.getAssignedRequests(agent.username,"Active").subscribe((asgndRequests)=>{
      this.allRequests = asgndRequests;
      
       for(var i=0;i<this.allRequests.length;i++){
      
      this.obj = {
            title: this.allRequests[i].reqdesc,
            start:new Date(this.allRequests[i].start),
            color:colors.yellow,
            end:new Date(this.allRequests[i].end),
            draggable:true,
            resizable:{
              beforeStart:true,
              afterEnd:true
            }
      }
      this.events.push(this.obj);
      console.log("Object  "+this.obj.start);
      this.refresh.next();
    }
    });
    
   this.refresh.next();
    // this.refresh.next();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }


  openJobDetails(event,requestdetails){
    this.eventDetails = event;
    this.modal.open(requestdetails).result.then((result)=>{

    },
    (reason)=>{

    });
  }

  openAgentJobs(agent,assignedjobs){
    this.assignedagentname = agent.name;
    this.assignedrequests = [];
    console.log(this.requests);
    for(var i= 0;i<this.requests.length;i++){
      if(this.requests[i].assignedto == agent.username){
        this.assignedrequests.push(this.requests[i]);
      }
    }
    this.modal.open(assignedjobs).result.then((result)=>{
      console.log(this.assignedrequests);
    },
    (reason)=>{
    console.log(reason);
  })
  }

}
  
