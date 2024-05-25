import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOneBarChartComponent } from './custom-one-bar-chart.component';

describe('CustomOneBarChartComponent', () => {
  let component: CustomOneBarChartComponent;
  let fixture: ComponentFixture<CustomOneBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomOneBarChartComponent]
    });
    fixture = TestBed.createComponent(CustomOneBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
