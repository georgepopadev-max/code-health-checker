import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DemoBannerComponent } from './components/demo-banner/demo-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DemoBannerComponent],
  template: `
    <app-demo-banner></app-demo-banner>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {}