import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dognut',
  templateUrl: './dognut.component.html',
  styleUrls: ['./dognut.component.scss'],
  standalone: true,
  imports: [
    NgxChartsModule,
  ]
})
export class DognutComponent {
  view: [number, number] = [300, 300];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  } as any

  single = [
    {
      "name": "Germany",
      "value": 8940000,
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
      {
      "name": "UK",
      "value": 6200000
    }
  ];

  customColors = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  } as any

  gradient = false;

  getColor(name: string): string {
    const index = this.single.findIndex(d => d.name === name);
    return this.colorScheme.domain[index % this.colorScheme.domain.length];
  }

  onSelect(e: any) {
    console.log('onSelect', e)
  }

  onActivate(e: any) {
    console.log('onActivate', e)
  }

  onDeactivate(e: any) {
    console.log('onDeactivate', e)
  }
}
