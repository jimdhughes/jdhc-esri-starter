import { Injectable, EventEmitter, Output } from '@angular/core';

export interface Point {
  lon: number;
  lat: number;
}

export type MeasurementType = 'none' | 'area' | 'perimiter' | 'distance';

@Injectable({
  providedIn: 'root'
})
export class ArcmapService {
  private mapZoom = 12;
  private mapMeasureMode: MeasurementType = 'none';
  private mapCenter: Point = { lat: -113.4909, lon: 53.544 };
  esriCenter: Point = { lat: -113.4909, lon: 53.544 };
  esriZoom = 12;

  @Output()
  measurementEmitter: EventEmitter<MeasurementType> = new EventEmitter<MeasurementType>();
  @Output()
  zoomEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  centerEmitter: EventEmitter<Point> = new EventEmitter<Point>();

  constructor() {}

  setCenter(p: Point) {
    this.mapCenter = p;
    this.centerEmitter.next(this.mapCenter);
  }
  get center() {
    return this.mapCenter;
  }

  setZoom(z: number) {
    this.mapZoom = z;
    this.zoomEmitter.next(this.mapZoom);
  }

  get zoom() {
    return this.mapZoom;
  }

  setMeasure(measure: MeasurementType) {
    this.mapMeasureMode = measure;
    this.measurementEmitter.next(this.mapMeasureMode);
  }

  getMapMeasure(): MeasurementType {
    return this.mapMeasureMode;
  }

  setEsriZoom(zoom: number) {
    this.esriZoom = zoom;
  }

  setEsriCenter(point: Point) {
    this.esriCenter = point;
  }
}
