import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { ArcmapService, MeasurementType, Point } from '../services/arcmap.service';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Expand from '@arcgis/core/widgets/Expand';
import Locate from '@arcgis/core/widgets/Locate';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import LayerList from '@arcgis/core/widgets/LayerList';
import Search from '@arcgis/core/widgets/Search';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

@Component({
  selector: 'app-arcmap',
  templateUrl: './arcmap.component.html',
  styleUrls: ['./arcmap.component.scss']
})
export class ArcmapComponent implements AfterViewInit {
  @ViewChild('arcmap', { static: false })
  private arcMapRef: ElementRef;
  mapView: MapView;
  map: Map;
  currentMeasurementType: MeasurementType;

  constructor(private arcMapService: ArcmapService) {}
  ngAfterViewInit() {
    this.init();
    this.arcMapService.zoomEmitter.subscribe((zoom: number) => {
      console.log('settnig zoom: ' + zoom);
      this.mapView.zoom = zoom;
    });
    this.arcMapService.centerEmitter.subscribe((center: Point) => {
      if (this.mapView.center.latitude !== center.lat || this.mapView.center.longitude !== center.lon) {
        console.log('settiing map center: {lat: ' + center.lat + ', lon: ' + center.lon + '}');
        console.log(this.mapView.zoom);
        this.mapView.goTo({
          center: [center.lon, center.lat]
        });
      }
    });
  }

  async init() {
    try {
      this.map = new Map({
        basemap: 'osm'
      });
      this.mapView = new MapView({
        map: this.map,
        center: [-113.4909, 53.544],
        zoom: 12,
        container: this.arcMapRef.nativeElement,
        ui: {
          components: ['attribution']
        }
      });
      this.mapView.when(async () => {
        this.initWidgets();
        this.initWatchers();
      });
    } catch (e) {
      console.error(e);
    }
  }

  async initWidgets() {

    const locateWidget = new Locate({
      view: this.mapView
    });
    const basemapWidget = new BasemapGallery({ view: this.mapView });
    const searchWidget = new Search({
      view: this.mapView
    });
    const layerListWidget = new LayerList({view:this.mapView});
    this.mapView.ui.add(new Expand({ view: this.mapView, content: searchWidget }), 'top-right');
    this.mapView.ui.add(new Expand({ view: this.mapView, content: basemapWidget }), 'top-right');
    this.mapView.ui.add(new Expand({ view: this.mapView, content: layerListWidget }), 'top-right');
    this.mapView.ui.add(locateWidget, 'top-right');
  }

  async initWatchers() {
    reactiveUtils.when(
      ()=>this.mapView.stationary, 
      () => {
      const { center, zoom } = this.mapView;
      if (
        center &&
        (center.latitude !== this.arcMapService.center.lat || center.longitude !== this.arcMapService.center.lon)
      ) {
        this.arcMapService.setEsriCenter({ lat: center.latitude, lon: center.longitude });
      }
      if (zoom && zoom !== this.arcMapService.zoom) {
        this.arcMapService.setEsriZoom(zoom);
      }
    });
  }
}
