import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  private API_KEY = "AIzaSyAkOqEJ5HsHhX2NICYmPgfJ_MgGcBaZT_k";

  position;

  constructor(private http: HttpClient) { }

  getAddress(textQuery : string){
    return(this.http.get("http://localhost:8080/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + textQuery + "&inputtype=textquery&fields=geometry&locationbias=ipbias&key=" + this.API_KEY))
  }

  getCurrentLocation(){
    return(this.http.get("http://localhost:8080/https://www.googleapis.com/geolocation/v1/geolocate?key=" + this.API_KEY));
  }
}
