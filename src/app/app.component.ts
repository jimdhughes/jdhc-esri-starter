import { Component } from '@angular/core';
import { ArcmapService } from './services/arcmap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ESRI Starter';
  isMenuOpen = true;
  navItems = [
    {
      title: 'Calgary',
      locations: [
        {
          title: 'Saddledome',
          location: {
            lat: 51.0374336,
            lon: -114.0519341
          },
          zoom: 16
        },
        {
          title: 'McMahon Stadium',
          location: {
            lat: 51.0703813,
            lon: -114.1214653
          },
          zoom: 16
        }
      ]
    },
    {
      title: 'Edmonton',
      locations: [
        {
          title: 'Rogers Place',
          location: {
            lat: 53.5469828,
            lon: -113.4979082
          },
          zoom: 16
        },
        {
          title: 'Commonwealth Stadium',
          location: {
            lat: 53.5596184,
            lon: -113.4761666
          },
          zoom: 16
        }
      ]
    },
    {
      title: 'Toronto',
      locations: [
        {
          title: 'Scotiabank Arena',
          location: {
            lat: 43.6434661,
            lon: -79.3790989
          },
          zoom: 16
        },
        {
          title: 'BMO Field',
          location: {
            lat: 43.6332247,
            lon: -79.4185654
          },
          zoom: 16
        }
      ]
    },
    {
      title: 'Vancouver',
      locations: [
        {
          title: 'Rogers Arena',
          location: {
            lat: 49.2778358,
            lon: -123.1088227
          },
          zoom: 16
        },
        {
          title: 'BC Place',
          location: {
            lat: 49.27675,
            lon: -123.111999
          },
          zoom: 16
        }
      ]
    }
  ];
  constructor(private service: ArcmapService) {}

  onMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onGotoLocation(location: { lat: number; lon: number }, zoom: number) {
    this.service.setZoom(zoom);
    this.service.setCenter(location);
  }
}
