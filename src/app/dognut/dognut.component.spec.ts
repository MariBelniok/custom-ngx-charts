import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DognutComponent } from './dognut.component';

describe('DognutComponent', () => {
  let component: DognutComponent;
  let fixture: ComponentFixture<DognutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DognutComponent]
    });
    fixture = TestBed.createComponent(DognutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
