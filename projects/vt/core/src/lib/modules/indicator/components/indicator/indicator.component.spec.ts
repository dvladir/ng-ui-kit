import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorComponent } from './indicator.component';
import {INDICATOR_ICON} from '../../shared/indicator-icon';

describe('IndicatorComponent', () => {
  let component: IndicatorComponent;
  let fixture: ComponentFixture<IndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorComponent ],
      providers: [
        {
          provide: INDICATOR_ICON,
          useValue: 'fa-dharmachakra'
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
