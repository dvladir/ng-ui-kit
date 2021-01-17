import { PlaceholderCaptionDirective } from './placeholder-caption.directive';
import {Component} from '@angular/core';
import {SimpleMessage} from '../shared/simple-message';
import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TranslationHelperService} from '../services/translation-helper.service';
import {MockTnsHelper} from '../services/mock-tns-helper';

@Component({
  selector: 'vtc-test',
  template: `
    <input type="text" id="iptA" vtcPlaceholderCaption="hello" sfx=":"/>
    <input type="text" id="iptB" vtcPlaceholderCaption="ok" view="MESSAGE" pfx="LOL "/>
    <input type="text" id="iptC" [vtcPlaceholderCaption]="simpleMessage"/>
  `
})
class TestComponent {
  simpleMessage: SimpleMessage = {message: 'ok', view: 'MESSAGE'};
}

describe('PlaceholderCaptionDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async( () => {
    TestBed.configureTestingModule({
      providers: [{
        provide: TranslationHelperService,
        useClass: MockTnsHelper
      }],
      declarations: [
        PlaceholderCaptionDirective,
        TestComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('check translations', waitForAsync(() => {

    const getPlaceholder = (selector: string) => (fixture.nativeElement as HTMLElement)
      .querySelector(selector)!
      .getAttribute('placeholder');

    fixture.detectChanges();

    const a = getPlaceholder('#iptA');
    const b = getPlaceholder('#iptB');
    const c = getPlaceholder('#iptC');

    expect(a).toEqual('Hello world:');
    expect(b).toEqual('LOL Ok message');
    expect(c).toEqual('Ok message');

    component.simpleMessage = {message: 'test', view: 'TEST'};
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const changedC = getPlaceholder('#iptC');
      expect(changedC).toEqual('Test test test');
    });
  }));
});
