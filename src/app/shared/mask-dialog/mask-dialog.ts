import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EdgeMask } from 'opencv-ng';

function maskToImageData(mask: EdgeMask, rgba: [number, number, number, number]): ImageData {
  const { data, width, height } = mask;
  const out = new Uint8ClampedArray(width * height * 4);
  const [r, g, b, a] = rgba;
  for (let i = 0, j = 0; i < data.length; i++, j += 4) {
    if (data[i]) { out[j] = r; out[j+1] = g; out[j+2] = b; out[j+3] = a; }
    else { out[j+3] = 0; }
  }
  return new ImageData(out, width, height);
}

function imageDataToDataURL(img: ImageData): string {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  c.getContext('2d')!.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

export interface MaskDialogData {
  mask: EdgeMask;
  color?: [number, number, number];
  alpha?: number;
  filename?: string;
}

@Component({
  selector: 'app-mask-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './mask-dialog.html',
  styleUrl: './mask-dialog.scss'
})
export class MaskDialog {
  data : MaskDialogData = inject(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<MaskDialog>)
  readonly color = signal<[number, number, number]>(
    this.data.color ?? [0, 255, 0]
  );
  readonly alpha = signal<number>(this.data.alpha ?? 255);
  readonly fileName = this.data.filename ?? 'edge-mask.png';

  readonly pngUrl = computed(() => {
    const rgba: [number, number, number, number] = [...this.color(), this.alpha()] as any;
    const img = maskToImageData(this.data.mask, rgba);
    return imageDataToDataURL(img);
  });

  close() { this.ref.close(); }

}
