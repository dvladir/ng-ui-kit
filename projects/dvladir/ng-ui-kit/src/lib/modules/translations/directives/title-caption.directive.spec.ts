import { TitleCaptionDirective } from './title-caption.directive';
import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TranslationHelperService} from '../services/translation-helper.service';
import {MockTnsHelper} from '../services/mock-tns-helper';
import {SimpleMessage} from '../shared/simple-message';
import {Component} from '@angular/core';


@Component({
  selector: 'dv-test',
  template: `
    <span id="spA" dvTitleCaption="hello" sfx=":"></span>
    <span id="spB" dvTitleCaption="ok" view="MESSAGE" pfx="LOL "></span>
    <span id="spC" [dvTitleCaption]="simpleMessage"></span>
  `
})
class TestComponent {
  simpleMessage: SimpleMessage = {message: 'ok', view: 'MESSAGE'};
}

describe('TitleCaptionDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async( () => {
    TestBed.configureTestingModule({
      providers: [{
        provide: TranslationHelperService,
        useClass: MockTnsHelper
      }],
      declarations: [
        TitleCaptionDirective,
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

    const getTitle = (selector: string) => (fixture.nativeElement as HTMLElement).querySelector(selector)!.getAttribute('title');

    fixture.detectChanges();

    const a = getTitle('#spA');
    const b = getTitle('#spB');
    const c = getTitle('#spC');

    expect(a).toEqual('Hello world:');
    expect(b).toEqual('LOL Ok message');
    expect(c).toEqual('Ok message');

    component.simpleMessage = {message: 'test', view: 'TEST'};
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const changedC = getTitle('#spC');
      expect(changedC).toEqual('Test test test');
    });
  }));
});
