import { Injectable, ViewChild, ElementRef } from '@angular/core';

declare var H: any;

@Injectable({
  providedIn: 'root'
})

export class HereMapService {

  public platform: any;
  public geocoder: any;
  public map: any;

  @ViewChild('mapContainer') targetElement: ElementRef; 

  constructor() {
    this.platform = new H.service.Platform({
        "app_id": "fag1SEc67LrF8clS7SuE",
        "app_code": "oxZZk80QAOMaJa4rEjp7Gg"
    });
    const defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      this.targetElement,
      defaultLayers.normal.map
      ({
        zoom: 10,
        center: { lat: 52.51, lng: 13.4 }
        }));
    

    this.geocoder = this.platform.getGeocodingService();
   }

   getAddress(query: string) {

   }
}
