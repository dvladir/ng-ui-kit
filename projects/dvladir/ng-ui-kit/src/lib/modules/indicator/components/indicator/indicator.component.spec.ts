import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorComponent } from './indicator.component';
import {INDICATOR_ICON} from '../../shared/indicator-icon';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

@Component({
  selector: 'dv-indicator-host-component',
  template: `
    <dv-indicator [classes]="additionalClasses"></dv-indicator>
  `
})
class IndicatorHostComponent {
  additionalClasses?: string;
}

describe('IndicatorComponent', () => {
  let component: IndicatorHostComponent;
  let fixture: ComponentFixture<IndicatorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorComponent, IndicatorHostComponent ],
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
    fixture = TestBed.createComponent(IndicatorHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Classes change', () => {
    const iconElement = fixture.debugElement.query(By.css('.fa')).nativeElement as HTMLElement;
    expect(iconElement.classList.contains('fa-dharmachakra')).toBeTrue();
    expect(iconElement.classList.contains('fa-2x')).toBeFalse();
    expect(iconElement.classList.contains('foo')).toBeFalse();
    expect(iconElement.classList.contains('bar')).toBeFalse();
    expect(iconElement.classList.contains('baz')).toBeFalse();

    component.additionalClasses = 'fa-2x foo';
    fixture.detectChanges();
    expect(iconElement.classList.contains('fa-dharmachakra')).toBeTrue();
    expect(iconElement.classList.contains('fa-2x')).toBeTrue();
    expect(iconElement.classList.contains('foo')).toBeTrue();
    expect(iconElement.classList.contains('bar')).toBeFalse();
    expect(iconElement.classList.contains('baz')).toBeFalse();

    component.additionalClasses = 'bar baz';
    fixture.detectChanges();
    expect(iconElement.classList.contains('fa-dharmachakra')).toBeTrue();
    expect(iconElement.classList.contains('fa-2x')).toBeFalse();
    expect(iconElement.classList.contains('foo')).toBeFalse();
    expect(iconElement.classList.contains('bar')).toBeTrue();
    expect(iconElement.classList.contains('baz')).toBeTrue();
  });
});
