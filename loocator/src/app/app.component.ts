import { Component, OnInit } from '@angular/core';
import { GoogleMapService } from './google-map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'loocator';

  current_address="";
  desired_address="";
  position;

  constructor(
    private googleMapService: GoogleMapService
  ) {}

  ngOnInit() {
    this.googleMapService.getAddress("Physical%20Sciences%Building")
      .subscribe(
        (data) => {
          console.log(data);
        }
      );
   }
}
