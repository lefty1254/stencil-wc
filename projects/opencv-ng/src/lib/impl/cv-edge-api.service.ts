import { Injectable, inject } from '@angular/core';
import { OPENCV, type CV } from '../common/opencv.token';
import { EDGE_API } from '../common/edge.token';
import type {
    EdgeApi,
    EdgeAlgoId,
    EdgeParamsMap,
    EdgeMask,
    CannyParams,
    SobelParams,
    LaplacianParams
} from '../common/edge.types';

@Injectable({ providedIn: 'root' })
export class CvEdgeApi implements EdgeApi {
    private readonly cv: CV = inject(OPENCV);
    constructor() {
        // just for a quick smoke test; remove later
        console.debug('OpenCV:', this.cv.getBuildInformation?.().slice(0, 120));
    }

    private srcMat: any | null = null;   // impl-detail mats
    private grayMat: any | null = null;

    async setSource(srcRgba: ImageData): Promise<void> {
        const cv = this.cv;
        this.dispose();
        const src = cv.matFromImageData(srcRgba);
        const gray = new cv.Mat();
        try {
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
            this.srcMat = src;
            this.grayMat = gray;
        } catch (e) {
            src.delete(); gray.delete?.();
            throw e;
        }
    }

    async makeGray(src: ImageData): Promise<ImageData> {
        const cv = this.cv;
        const s = cv.matFromImageData(src), g = new cv.Mat(), g4 = new cv.Mat();
        try {
            cv.cvtColor(s, g, cv.COLOR_RGBA2GRAY);
            cv.cvtColor(g, g4, cv.COLOR_GRAY2RGBA);
            return new ImageData(new Uint8ClampedArray(g4.data), g4.cols, g4.rows);
        } finally { s.delete(); g.delete(); g4.delete(); }
    }

    async computeEdgeMask<A extends EdgeAlgoId>(algo: A, p: EdgeParamsMap[A]): Promise<EdgeMask> {
        const cv = this.cv;
        if (!this.grayMat) throw new Error('No source loaded');

        const edges = new cv.Mat();
        try {
            switch (algo) {
                case 'canny': await this.canny(edges, p as CannyParams); break;
                case 'sobel': await this.sobel(edges, p as SobelParams); break;
                case 'laplacian': await this.laplacian(edges, p as LaplacianParams); break;
                default: throw new Error(`Unknown edge algo ${algo as string}`);
            }
            return { data: new Uint8Array(edges.data), width: edges.cols, height: edges.rows };
        } finally { edges.delete(); }
    }

    dispose(): void {
        this.srcMat?.delete?.(); this.srcMat = null;
        this.grayMat?.delete?.(); this.grayMat = null;
    }

    // ---- per-algo helpers ----
    private async canny(edges: any, p: CannyParams) {
        const cv = this.cv;
        const { low, high, thickness = 1 } = p;
        cv.Canny(this.grayMat, edges, low, high);
        this.dilateInPlace(edges, thickness);
    }

    private async sobel(edges: any, p: SobelParams) {
        const cv = this.cv;
        const { ksize = 3, scale = 1, delta = 0, thickness = 1 } = p;
        const gx = new cv.Mat(), gy = new cv.Mat();
        try {
            cv.Sobel(this.grayMat, gx, cv.CV_32F, 1, 0, ksize, scale, delta, cv.BORDER_DEFAULT);
            cv.Sobel(this.grayMat, gy, cv.CV_32F, 0, 1, ksize, scale, delta, cv.BORDER_DEFAULT);

            if ((cv as any).magnitude) {
                const mag32 = new cv.Mat();
                try {
                    (cv as any).magnitude(gx, gy, mag32);
                    cv.normalize(mag32, mag32, 0, 255, cv.NORM_MINMAX);
                    cv.convertScaleAbs(mag32, edges);
                } finally { mag32.delete(); }
            } else if ((cv as any).cartToPolar) {
                const mag32 = new cv.Mat(), ang = new cv.Mat();
                try {
                    (cv as any).cartToPolar(gx, gy, mag32, ang, true);
                    cv.normalize(mag32, mag32, 0, 255, cv.NORM_MINMAX);
                    cv.convertScaleAbs(mag32, edges);
                } finally { mag32.delete(); ang.delete(); }
            } else {
                const ax = new cv.Mat(), ay = new cv.Mat();
                try {
                    cv.convertScaleAbs(gx, ax);
                    cv.convertScaleAbs(gy, ay);
                    cv.addWeighted(ax, 0.5, ay, 0.5, 0, edges);
                } finally { ax.delete(); ay.delete(); }
            }

            cv.threshold(edges, edges, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
            this.dilateInPlace(edges, thickness);
        } finally { gx.delete(); gy.delete(); }
    }

    private async laplacian(edges: any, p: LaplacianParams) {
        const cv = this.cv;
        const { ksize = 3, scale = 1, delta = 0, thickness = 1 } = p;
        const lap16 = new cv.Mat();
        try {
            cv.Laplacian(this.grayMat, lap16, cv.CV_16S, ksize, scale, delta, cv.BORDER_DEFAULT);
            cv.convertScaleAbs(lap16, edges);
            cv.threshold(edges, edges, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
            this.dilateInPlace(edges, thickness);
        } finally { lap16.delete(); }
    }

    private dilateInPlace(mat: any, k: number) {
        if (k <= 1) return;
        const cv = this.cv;
        const kernel = cv.Mat.ones(k, k, cv.CV_8U);
        try { cv.dilate(mat, mat, kernel); } finally { kernel.delete(); }
    }
}

// (optional) make DI of EDGE_API point to the browser impl here
@Injectable({ providedIn: 'root' })
export class _EdgeApiMarker { } // keep file a service file for tree-shaking friendliness
