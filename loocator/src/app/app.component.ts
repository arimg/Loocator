import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

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

  constructor(
    private hereMapService: HereMapService
  ) {}

  ngAfterViewInit() {
    const defaultLayers = this.hereMapService.platform.createDefaultLayers();
    // console.log(defaultLayers.normal.map);
    // console.log(this.targetElement);
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


    this.hereMapService.getRouting();
  }

  ngOnInit() {
    
  }
}
