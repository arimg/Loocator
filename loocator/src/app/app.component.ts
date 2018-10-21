import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { GoogleMapService } from './google-map.service';
import { HereMapService } from './here-map.service';

declare var H: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'loocator';
  @ViewChild('mapContainer') targetElement: ElementRef;
  @ViewChild('panel') instructionContainer: ElementRef;
  public map: any;

  current_address="";
  desired_address="";
  position;
  showCurrentLocationInput = false;

  constructor(
    private hereMapService: HereMapService,
    private googleMapService: GoogleMapService
  ) {}

  ngAfterViewInit() {
    const defaultLayers = this.hereMapService.platform.createDefaultLayers();
    this.map = new H.Map(
                          this.targetElement.nativeElement,
                          defaultLayers.normal.map,
                          {
                            zoom: 10,
                            center: { lat: 52.51, lng: 13.4 }
                          }
                        );
    this.hereMapService.getMap(this.map);
    this.hereMapService.getMapSideBar(this.instructionContainer);


    
  }

  ngOnInit() {
    this.googleMapService.getAddress("Physical%20Sciences%20Building")
      .subscribe(
        (data) => {
          // console.log(data);
        }
      );

    
   }

   getRoute(desiredAddress: string, currentAddress?: string) {
    this.googleMapService.getAddress(desiredAddress.replace(/\s+/g, "%20"))
      .subscribe(
        (data) => {
          const parsedData = JSON.parse(JSON.stringify(data));
          const pointB = parsedData.candidates[0].geometry.location.lat.toString().concat("," + parsedData.candidates[0].geometry.location.lng.toString());
          if (!this.showCurrentLocationInput) {
            this.findMe(pointB);
          } else {
            this.googleMapService.getAddress(currentAddress.replace(/\s+/g, "%20"))
            .subscribe(
              (data) => {
                const parsedData2 = JSON.parse(JSON.stringify(data));
                const pointA = parsedData2.candidates[0].geometry.location.lat.toString().concat("," + parsedData2.candidates[0].geometry.location.lng.toString());
                this.hereMapService.getRouting(pointA,pointB);
              })
          }
        }
      );
    
   }

   findMe(desiredAddress: string){
    if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        const pointA = position.coords.latitude.toString().concat("," + position.coords.longitude.toString());
        const pointB = desiredAddress;
        console.log(pointA, pointB);
        this.hereMapService.getRouting(pointA,pointB);
        //console.log(position.coords.longitude);
         this.position = position;
         console.log(this.position);
       }, (error) => {
         if(error.code === error.PERMISSION_DENIED){
           this.showCurrentLocationInput = true;
           alert("No location found, please enter manually");
         }
       });
     } else {
       alert("No location found, please enter manually");
       this.showCurrentLocationInput = true;
     }
   }

}
