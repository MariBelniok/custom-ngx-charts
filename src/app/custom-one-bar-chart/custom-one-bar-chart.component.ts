import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import {
  BarChartType,
  BaseChartComponent,
  ColorHelper,
  NgxChartsModule,
  ScaleType,
  Series,
  ViewDimensions,
  calculateViewDimensions,
} from '@swimlane/ngx-charts';
import { scaleBand, scaleLinear } from 'd3-scale';

@Component({
  selector: 'horizontal-bar-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="false"
      [activeEntries]="activeEntries"
    >
      <svg:g
        *ngFor="let group of results; let index = index; trackBy: trackBy;"
        [attr.transform]="groupTransform(group)"
      >
        <svg:g
          ngx-charts-series-horizontal
          [type]="barChartType.Stacked"
          [xScale]="xScale"
          [yScale]="yScale"
          [colors]="colors"
          [series]="group.series"
          [activeEntries]="activeEntries"
          [dims]="dims"
          [gradient]="gradient"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [animations]="animations"
          [showDataLabel]="showDataLabel"
          [dataLabelFormatting]="dataLabelFormatting"
          [noBarWhenZero]="noBarWhenZero"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['./custom-one-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgxChartsModule],
  encapsulation: ViewEncapsulation.None,
})
export class HorizontalBarChartComponent extends BaseChartComponent {
  @Input() xAxis;
  @Input() yAxis;
  @Input() tooltipDisabled: boolean = false;
  @Input() gradient: boolean;
  @Input() activeEntries: any[] = [];
  @Input() xScaleMax: number;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero: boolean = true;
  @Input() wrapTicks = false;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  groupDomain: string[];
  innerDomain: string[];
  valueDomain: [number, number];
  xScale: any;
  yScale: any;
  colors: ColorHelper;
  margin = [0, 0, 0, 0];

  barChartType = BarChartType;

  override update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
    });

    this.groupDomain = this.getGroupDomain();
    this.valueDomain = this.getValueDomain();

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();
  }

  getGroupDomain(): string[] {
    const domain = [];

    for (const group of this.results) {
      if (!domain.includes(group.label)) {
        domain.push(group.label);
      }
    }

    return domain;
  }

  getValueDomain(): [number, number] {
    const domain = [];
    let smallest = 0;
    let biggest = 0;
    for (const group of this.results) {
      let smallestSum = 0;
      let biggestSum = 0;
      for (const d of group.series) {
        if (d.value < 0) {
          smallestSum += d.value;
        } else {
          biggestSum += d.value;
        }
        smallest = d.value < smallest ? d.value : smallest;
        biggest = d.value > biggest ? d.value : biggest;
      }
      domain.push(smallestSum);
      domain.push(biggestSum);
    }
    domain.push(smallest);
    domain.push(biggest);

    const min = Math.min(0, ...domain);
    const max = this.xScaleMax
      ? Math.max(this.xScaleMax, ...domain)
      : Math.max(...domain);
    return [min, max];
  }

  getYScale(): any {
    return scaleBand()
      .rangeRound([0, this.dims.height])
      .paddingInner(0)
      .domain(this.groupDomain);
  }

  getXScale(): any {
    return scaleLinear()
      .range([0, this.dims.width])
      .domain(this.valueDomain);
  }

  groupTransform(group: Series): string {
    return `translate(0, ${this.yScale(group.name)})`;
  }

  /**
   * Angular ng for track by
   */
  trackBy: TrackByFunction<Series> = (index: number, item: Series) => {
    return item.name;
  };

  /**
   * Set chart colors
   */
  setColors(): void {
    this.colors = new ColorHelper(
      this.scheme,
      ScaleType.Ordinal,
      this.valueDomain
    );
  }
}
