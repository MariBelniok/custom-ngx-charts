import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DognutComponent } from './dognut/dognut.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgxChartsModule, DognutComponent],
  standalone: true,
})
export class AppComponent {

}
