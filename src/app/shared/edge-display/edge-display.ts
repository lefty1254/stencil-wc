import { Component, computed, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EdgeMask, RGBA } from 'opencv-ng';
import { MaskDialog } from '../mask-dialog/mask-dialog';

function imageDataToDataURL(img: ImageData | null): string | null {
  if (!img) return null;
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  c.getContext('2d')!.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

function colorizeMask(mask: EdgeMask, [r,g,b,a]: RGBA): ImageData {
  const { data, width, height } = mask;
  const out = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, j = 0; i < data.length; i++, j += 4) {
    if (data[i]) { out[j] = r; out[j+1] = g; out[j+2] = b; out[j+3] = a; }
    else { out[j+3] = 0; } // transparent
  }
  return new ImageData(out, width, height);
}

@Component({
  selector: 'edge-display',
  imports: [FormsModule],
  templateUrl: './edge-display.html',
  styleUrl: './edge-display.scss'
})
export class EdgeDisplay {
  readonly baseImage = input.required<ImageData | null>();
  readonly mask      = input<EdgeMask | null>(null);
  readonly alt       = input<string>('image');

  // Optional initial color (#rrggbb)
  readonly initialColor = model<string>('#f50000');

  // Internal color/alpha signals
  readonly color = computed(()=>this.hexToRgb(this.initialColor()));
  readonly alpha = signal<number>(255);

  // Computed URLs
  readonly baseUrl  = computed(() => imageDataToDataURL(this.baseImage()));
  readonly overlayUrl = computed(() => {
    const m = this.mask();
    if (!m) return null;
    const [r,g,b] = this.color();
    const a = this.alpha();
    return imageDataToDataURL(colorizeMask(m, [r,g,b,a]));
  });

  private hexToRgb(hex: string): [number, number, number] {
    const h = hex.startsWith('#') ? hex.slice(1) : hex;
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  private dialog = inject(MatDialog)
  openDialog() {
    const m = this.mask();
    if (!m) return;
    const [r,g,b] = this.color();
    const a = this.alpha();
    this.dialog.open(MaskDialog, {
      data: { 
        mask: m,
        color: [r,g,b],
        alpha : a,
        filename: 'edge-mask.png'
      },
      width : 'min(95vw, 1100px)',
      autoFocus: false
    });
  }

}
