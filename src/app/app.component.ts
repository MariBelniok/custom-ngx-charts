import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DognutComponent } from './dognut/dognut.component';
import { HorizontalBarChartComponent } from './custom-one-bar-chart/custom-one-bar-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgxChartsModule, DognutComponent, HorizontalBarChartComponent],
  standalone: true,
})
export class AppComponent {
  view: [number, number] = [300, 20];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  } as any;

  single = [
    {
      series: [
        {
          name: 'Compras',
          value: 10,
        },
        {
          name: 'Alimentação',
          value: 20,
        },
        {
          name: 'Saúde',
          value: 30,
        },
        {
          name: 'Outras',
          value: 40,
        },
      ],
    },
  ];
}
