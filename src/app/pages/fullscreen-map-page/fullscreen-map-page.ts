import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';

import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [],
  templateUrl: './fullscreen-map-page.html',
  styles: `
    div {
      width: 100vw;
      height: calc(100vh - 64px);
    }
  `,
})
export class FullscreenMapPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  async ngAfterViewInit() {

    if(!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80))

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    });
  }
}
