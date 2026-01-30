import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

import { v4 as UUIDv4 } from 'uuid';
import { JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.html',
})
export class MarkersPage implements AfterViewInit {
  map = signal<mapboxgl.Map | null>(null);
  divElement = viewChild<ElementRef>('map');
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.40985, 37.793085],
      zoom: 11,
    });

    const newMarker = new mapboxgl.Marker({
      draggable: false,
      color: 'blue',
    })
      .setLngLat([-122.40985, 37.793085])
      .addTo(map);

    newMarker.on('dragend', (event) => {
      console.log(event);
    });

    this.mapListeners(map);
  }
  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => this.mapClick(event));
    this.map.set(map);
  }
  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;

    const map = this.map()!;

    const randomColor = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16),
    );

    const coords = event.lngLat;

    const clickMarker = new mapboxgl.Marker({
      color: randomColor,
    })
      .setLngLat(coords)
      .addTo(map);

    const newMarker: Marker = {
      id: UUIDv4(),
      mapboxMarker: clickMarker,
    };
    this.markers.set([newMarker, ...this.markers()]);
  }
  flyToMarker(lngLat: LngLatLike){
    if(!this.map()) return;

    this.map()?.flyTo({
      center: lngLat
    })
  }

  deleteMarker(marker: Marker){
    if(!this.map()) return;

    const map = this.map()!;

    marker.mapboxMarker.remove();

    this.markers.set(this.markers().filter((m) => m.id === marker.id))

  }
}
