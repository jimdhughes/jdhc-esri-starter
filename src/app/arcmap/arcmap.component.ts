import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { ArcmapService, MeasurementType, Point } from '../services/arcmap.service';

@Component({
  selector: 'app-arcmap',
  templateUrl: './arcmap.component.html',
  styleUrls: ['./arcmap.component.scss']
})
export class ArcmapComponent implements OnInit {
  @ViewChild('arcmap', { static: false })
  private arcMapRef: ElementRef;
  mapView: esri.MapView;
  map: esri.Map;
  measurementWidget: esri.AreaMeasurement2D | esri.DistanceMeasurement2D;
  currentMeasurementType: MeasurementType;

  constructor(private arcMapService: ArcmapService) {}

  ngOnInit() {
    this.init();
    this.arcMapService.measurementEmitter.subscribe(measurement => {
      this.toggleMeasurementWidget(measurement);
    });
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
      const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView']);
      this.map = new Map({
        basemap: 'hybrid'
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
    const [Search, BasemapGallery, Expand, Locate] = await loadModules([
      'esri/widgets/Search',
      'esri/widgets/BasemapGallery',
      'esri/widgets/Expand',
      'esri/widgets/Locate'
    ]);
    const locateWidget = new Locate({
      view: this.mapView
    });
    const basemapWidget = new BasemapGallery({ view: this.mapView });
    const searchWidget = new Search({
      view: this.mapView
    });
    this.mapView.ui.add(new Expand({ view: this.mapView, content: searchWidget }), 'top-right');
    this.mapView.ui.add(new Expand({ view: this.mapView, content: basemapWidget }), 'top-right');
    this.mapView.ui.add(locateWidget, 'top-right');
  }

  async toggleMeasurementWidget(type: 'area' | 'perimiter') {
    if (this.currentMeasurementType === type) {
      return;
    }
    this.currentMeasurementType = type;
    if (this.measurementWidget) {
      this.measurementWidget.viewModel.clearMeasurement();
      this.mapView.ui.remove(this.measurementWidget);
    }
    if (type === 'area' || type === 'perimiter') {
      const [AreaMeasurement2D] = await loadModules(['esri/widgets/AreaMeasurement2D']);
      this.measurementWidget = new AreaMeasurement2D({
        view: this.mapView
      });
    } else if (type === 'distance') {
      const [DistanceMeasurement2D] = await loadModules(['esri/widgets/DistanceMeasurement2D']);
      this.measurementWidget = new DistanceMeasurement2D({
        view: this.mapView
      });
    } else if (type === 'none') {
      console.log('stopping measurement');
      this.measurementWidget.viewModel.clearMeasurement();
      this.measurementWidget.destroy();
      this.mapView.ui.remove(this.measurementWidget);
      return;
    }

    this.measurementWidget.viewModel.newMeasurement();
    this.mapView.ui.add(this.measurementWidget, 'bottom-right');
  }

  async initWatchers() {
    const [watchUtils] = await loadModules(['esri/core/watchUtils']);
    watchUtils.whenTrue(this.mapView, 'stationary', () => {
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
