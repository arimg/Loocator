import { Injectable } from '@angular/core';

declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class HereMapService {

  public platform: any;
  public geocoder: any;

  constructor() {
    this.platform = new H.service.Platform({
        "app_id": "fag1SEc67LrF8clS7SuE",
        "app_code": "oxZZk80QAOMaJa4rEjp7Gg"
    });

    this.geocoder = this.platform.getGeocodingService();
   }

   getAddress(query: string) {

   }
}
