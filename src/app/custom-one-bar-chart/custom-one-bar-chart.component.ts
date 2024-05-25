import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  TrackByFunction,
  ViewEncapsulation
} from '@angular/core';
import { BarChartType, BaseChartComponent, ColorHelper, LegendOptions, LegendPosition, NgxChartsModule, ScaleType, Series, ViewDimensions, calculateViewDimensions } from '@swimlane/ngx-charts';
import { scaleBand, scaleLinear } from 'd3-scale';

@Component({
  selector: 'horizontal-bar-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="false"
      [activeEntries]="activeEntries"
    >
      <svg:g [attr.transform]="transform" class="bar-chart chart">
        <svg:g>
          <svg:g
            *ngFor="let group of results; let index = index; trackBy: trackBy"
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
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgxChartsModule],
})
export class HorizontalBarChartComponent extends BaseChartComponent {
  @Input() xAxis;
  @Input() yAxis;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() tooltipDisabled: boolean = false;
  @Input() gradient: boolean;
  @Input() showGridLines: boolean = true;
  @Input() activeEntries: any[] = [];
  @Input() override schemeType: ScaleType;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() barPadding: number = 8;
  @Input() roundDomains: boolean = false;
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
  transform: string;
  colors: ColorHelper;
  margin = [0, 0, 0, 0];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  dataLabelMaxWidth: any = { negative: 0, positive: 0 };

  barChartType = BarChartType;
  isSSR = false;

  override update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
    });

    this.groupDomain = this.getGroupDomain();
    this.innerDomain = this.getInnerDomain();
    this.valueDomain = this.getValueDomain();

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
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

  getInnerDomain(): string[] {
    const domain = [];

    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.label)) {
          domain.push(d.label);
        }
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
    const max = this.xScaleMax ? Math.max(this.xScaleMax, ...domain) : Math.max(...domain);
    return [min, max];
  }

  getYScale(): any {
    const spacing = this.groupDomain.length / (this.dims.height / this.barPadding + 1);

    return scaleBand().rangeRound([0, this.dims.height]).paddingInner(spacing).domain(this.groupDomain);
  }

  getXScale(): any {
    const scale = scaleLinear().range([0, this.dims.width]).domain(this.valueDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  groupTransform(group: Series): string {
    return `translate(0, ${this.yScale(group.name)})`;
  }


  trackBy: TrackByFunction<Series> = (index: number, item: Series) => {
    return item.name;
  };

  /**
   * Set chart colors
   */
  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.innerDomain;
    } else {
      domain = this.valueDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
  }
}
