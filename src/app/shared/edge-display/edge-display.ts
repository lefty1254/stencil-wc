import { Component, computed, input } from '@angular/core';
import { imageDataToDataURL } from '../../core/utils/canvas';

@Component({
  selector: 'edge-display',
  imports: [],
  templateUrl: './edge-display.html',
  styleUrl: './edge-display.scss'
})
export class EdgeDisplay {
  readonly baseImage = input.required<ImageData | null>();
  readonly overlayImage = input<ImageData | null>(null);
  readonly size = input.required<{ w: number; h: number }>();
  readonly alt = input<string>('image');

  readonly baseUrl = computed(() => imageDataToDataURL(this.baseImage()));
  readonly overlayUrl = computed(() => imageDataToDataURL(this.overlayImage()));
  readonly ar = computed(() => `${this.size().w} / ${this.size().h}`);


}
