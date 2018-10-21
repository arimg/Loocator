import { Injectable, ViewChild, ElementRef, OnInit, Renderer2, RendererFactory2 } from '@angular/core';

declare var H: any;

@Injectable({
  providedIn: 'root'
})

export class HereMapService implements OnInit{

  public platform: any;
  public geocoder: any;
  public map: any;
  bubble: any;
  routeInstructionsContainer: ElementRef;
  ui: any;
  private renderer: Renderer2;
  

  targetElement: ElementRef; 

  constructor(
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.platform = new H.service.Platform({
        "app_id": "fag1SEc67LrF8clS7SuE",
        "app_code": "oxZZk80QAOMaJa4rEjp7Gg"
    });
    this.geocoder = this.platform.getGeocodingService();
    
   }

   ngOnInit() {
    this.ui = H.ui.UI.createDefault(this.map, this.platform.createDefaultLayers());
   }

   getAddress(query: string) {

   }

   getMap(map: any) {
     this.map = map;
   }

   getMapSideBar(instructionContainer: ElementRef) {
    this.routeInstructionsContainer = instructionContainer;
   }
  
   getRouting(pointA: string, pointB: string) {
     const routingParams = {
      // The routing mode:
      mode: 'fastest;car',
      // The start point of the route:
      waypoint0: 'geo!' + pointA,
      // The end point of the route:
      waypoint1: 'geo!' + pointB,
      // To retrieve the shape of the route we choose the route
      // representation mode 'display'
      representation: 'display'
    };

    const onResult = (result: any) => {
      if(result.response.route) {
        const route = result.response.route[0];
        // Pick the route's shape:
        const routeShape = route.shape;
        let linestring = new H.geo.LineString();
        routeShape.forEach((point) => {
          let parts = point.split(',');
          linestring.pushLatLngAlt(parts[0], parts[1]);
        });
        const startPoint = route.waypoint[0].mappedPosition;
        const endPoint = route.waypoint[1].mappedPosition;

        const routeLine = new H.map.Polyline(linestring, {
          style: { strokeColor: 'blue', lineWidth: 10 }
        });

        const startMarker = new H.map.Marker({
          lat: startPoint.latitude,
          lng: startPoint.longitude
        });

        const endMarker = new H.map.Marker({
          lat: endPoint.latitude,
          lng: endPoint.longitude
        });
      

        this.map.addObjects([routeLine, startMarker, endMarker]);
        this.map.setViewBounds(routeLine.getBounds()); 

        this.addRouteShapeToMap(route);
        this.addManueversToMap(route);
      
        this.addWaypointsToPanel(route.waypoint);
        this.addManueversToPanel(route);
        // this.addSummaryToPanel(route.summary);
      }
    }

    const router = this.platform.getRoutingService();

    router.calculateRoute(routingParams, onResult,
      (error) => {
        alert(error.message);
      });
    
   }

   addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline;
  
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });
  
    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    this.map.addObject(polyline);
    // And zoom to its bounding rectangle
    this.map.setViewBounds(polyline.getBounds(), true);
  }

  addManueversToMap(route){
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
        'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
      group = new  H.map.Group(),
      i,
      j;
  
    // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        const maneuver = route.leg[i].maneuver[j];
        // Add a marker to the maneuvers group
        const marker =  new H.map.Marker({
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude} ,
          {icon: dotIcon});
        marker.instruction = maneuver.instruction;
        group.addObject(marker);
      }
    }

    group.addEventListener('tap', function (evt) {
      this.map.setCenter(evt.target.getPosition());
      this.openBubble(
         evt.target.getPosition(), evt.target.instruction);
    }, false);
  
    // Add the maneuvers group to the map
    this.map.addObject(group);
  }

  addWaypointsToPanel(waypoints){



    var nodeH3 = document.createElement('h3'),
      waypointLabels = [],
      i;
  
  
     for (i = 0;  i < waypoints.length; i += 1) {
      waypointLabels.push(waypoints[i].label)
     }
  
     nodeH3.textContent = waypointLabels.join(' - ');
  
    this.routeInstructionsContainer.nativeElement.innerHTML = '';
    this.renderer.appendChild(this.routeInstructionsContainer.nativeElement, nodeH3);
  }

  addManueversToPanel(route){



    var nodeOL = document.createElement('ol'),
      i,
      j;
  
    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft ='5%';
    nodeOL.style.marginRight ='5%';
    nodeOL.className = 'directions';
  
       // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        const maneuver = route.leg[i].maneuver[j];
  
        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');
  
        spanArrow.className = 'arrow '  + maneuver.action;
        spanInstruction.innerHTML = maneuver.instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);
  
        nodeOL.appendChild(li);
      }
    }
  
    this.renderer.appendChild(this.routeInstructionsContainer.nativeElement, nodeOL);
  }
  
  addSummaryToPanel(summary){
    var summaryDiv = document.createElement('div'),
     content = '';
     content += '<b>Total distance</b>: ' + summary.distance  + 'm. <br/>';
     content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';
  
  
    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft ='5%';
    summaryDiv.style.marginRight ='5%';
    summaryDiv.innerHTML = content;
    this.renderer.appendChild(this.routeInstructionsContainer.nativeElement, summaryDiv);
  }
  

  openBubble(position, text){

    if(!this.bubble){
      this.bubble =  new H.ui.InfoBubble(
         position,
         // The FO property holds the province name.
         {content: text});
       this.ui.addBubble(this.bubble);
     } else {
      this.bubble.setPosition(position);
      this.bubble.setContent(text);
      this.bubble.open();
     }
   }
   
}
