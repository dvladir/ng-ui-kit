import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionComponent } from './caption.component';
import {TranslationHelperService} from '../../services/translation-helper.service';
import {MockTnsHelper} from '../../services/mock-tns-helper';
import {CaptionDirective} from '../../directives/caption.directive';

describe('CaptionComponent', () => {
  let component: CaptionComponent;
  let fixture: ComponentFixture<CaptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptionDirective, CaptionComponent ],
      providers: [
        {
          provide: TranslationHelperService,
          useClass: MockTnsHelper
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(async () => {

    const getContent = () => (fixture.nativeElement as HTMLElement).querySelector('span')!.innerHTML;

    expect(component).toBeTruthy();
    component.value = 'hello';

    await fixture.whenStable();
    fixture.detectChanges();
    expect(getContent()).toEqual('Hello world');

    component.value = {message: 'ok', view: 'MESSAGE'};
    component.sfx = ':';

    await fixture.whenStable();
    fixture.detectChanges();
    expect(getContent()).toEqual('Ok message:');
  }));
});
