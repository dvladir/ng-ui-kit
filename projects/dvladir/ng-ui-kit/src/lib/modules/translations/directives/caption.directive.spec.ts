import { CaptionDirective } from './caption.directive';
import {Component} from '@angular/core';
import {SimpleMessage} from '../shared/simple-message';
import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TranslationHelperService} from '../services/translation-helper.service';
import {MockTnsHelper} from '../services/mock-tns-helper';

@Component({
  selector: 'dv-test',
  template: `
    <span id="spA" dvCaption="hello" sfx=":"></span>
    <span id="spB" dvCaption="ok" view="MESSAGE" pfx="LOL "></span>
    <span id="spC" [dvCaption]="simpleMessage"></span>
  `
})
class TestComponent {
  simpleMessage: SimpleMessage = {message: 'ok', view: 'MESSAGE'};
}

describe('CaptionDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async( () => {
    TestBed.configureTestingModule({
      providers: [{
        provide: TranslationHelperService,
        useClass: MockTnsHelper
      }],
      declarations: [
        CaptionDirective,
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

    const getInnerHtml = (selector: string) => (fixture.nativeElement as HTMLElement).querySelector(selector)!.innerHTML;

    fixture.detectChanges();

    const a = getInnerHtml('#spA');
    const b = getInnerHtml('#spB');
    const c = getInnerHtml('#spC');

    expect(a).toEqual('Hello world:');
    expect(b).toEqual('LOL Ok message');
    expect(c).toEqual('Ok message');

    component.simpleMessage = {message: 'test', view: 'TEST'};
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const changedC = getInnerHtml('#spC');
      expect(changedC).toEqual('Test test test');
    });
  }));
});
