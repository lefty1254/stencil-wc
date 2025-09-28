// src/app/elements/register-element.ts
import { createCustomElement } from '@angular/elements';
import { bootstrapApplication } from '@angular/platform-browser';
import { Workbench } from '../features/workbench/workbench';
import { workbenchConfig } from './wrokbench.config';

export async function registerStencilElement() {
  // Bootstrap once to get an injector; component is standalone
  const appRef = await bootstrapApplication(Workbench, workbenchConfig);
  const el = createCustomElement(Workbench, { injector: appRef.injector });
  customElements.define('stencil-workbench', el);
}
