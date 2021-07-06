import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiChoiceModalComponent} from './multi-choice-modal.component';
import {ModalRef} from '../../shared/modal-ref';
import {CaptionComponent} from '../../../translations/components/caption/caption.component';
import {ModalBodyComponent} from '../modal-body/modal-body.component';
import {ModalDialogComponent} from '../modal-dialog/modal-dialog.component';
import {ModalFooterComponent} from '../modal-footer/modal-footer.component';
import {MultiChoiceModalData} from '../../shared/multi-choice-modal-data';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

enum TestChoices {
  chooseA = 'chooseA',
  chooseB = 'chooseB',
  chooseC = 'chooseC'
}

const modalRef: ModalRef<MultiChoiceModalData<TestChoices>, TestChoices> = {
  data: {
    message: 'choose',
    buttons: [
      {
        value: TestChoices.chooseA,
        btnClass: 't_ch_a',
        isDefault: true,
        caption: 'A',
        btnIcon: 'icon_a'
      },
      {
        value: TestChoices.chooseB,
        btnClass: 't_ch_b',
        caption: 'B'
      },
      {
        value: TestChoices.chooseC,
        btnClass: 't_ch_c',
        caption: 'C'
      }
    ]
  },
  showCloseButton: false,
  close(result?: TestChoices): void {
  }
};

describe('MultiChoiceModalComponent', () => {
  let component: MultiChoiceModalComponent;
  let fixture: ComponentFixture<MultiChoiceModalComponent>;

  const getLayout = () => {

    const bodyCaption = fixture.debugElement
      .query(By.directive(ModalBodyComponent))
      .query(By.directive(CaptionComponent));

    const buttons = fixture.debugElement
      .query(By.directive(ModalFooterComponent))
      .queryAll(By.css('button'));

    return {bodyCaption, buttons};
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CaptionComponent,
        MultiChoiceModalComponent,
        ModalDialogComponent,
        ModalBodyComponent,
        ModalFooterComponent
      ],
      providers: [
        {
          provide: ModalRef,
          useValue: modalRef
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Test layout', () => {

    const {bodyCaption, buttons} = getLayout();
    expect(bodyCaption.componentInstance.value).toEqual('choose');

    expect(buttons.length).toBe(3);

    const [btnA, btnB, btnC] = [
      buttons[0],
      buttons[1],
      buttons[2]
    ];

    expect(btnA.classes.t_ch_a).toBeTrue();
    expect(btnB.classes.t_ch_b).toBeTrue();
    expect(btnC.classes.t_ch_c).toBeTrue();

    expect(btnA.query(By.css('i'))).not.toBeNull();
    expect(btnA.query(By.css('i')).classes.icon_a).toBeTrue();

    expect(btnB.query(By.css('i'))).toBeNull();
    expect(btnC.query(By.css('i'))).toBeNull();

    const captionA = btnA.query(By.directive(CaptionComponent));
    const captionB = btnB.query(By.directive(CaptionComponent));
    const captionC = btnC.query(By.directive(CaptionComponent));

    expect(captionA).not.toBeNull();
    expect(captionA.componentInstance.value).toEqual('A');

    expect(captionB).not.toBeNull();
    expect(captionB.componentInstance.value).toEqual('B');

    expect(captionC).not.toBeNull();
    expect(captionC.componentInstance.value).toEqual('C');
  });

  it('Handle close', () => {
    const spyClose = spyOn(modalRef, 'close').and.callThrough();
    const {buttons} = getLayout();

    expect(modalRef.close).not.toHaveBeenCalled();
    buttons[0].nativeElement.click();
    expect(modalRef.close).toHaveBeenCalledWith(TestChoices.chooseA);
    spyClose.calls.reset();

    expect(modalRef.close).not.toHaveBeenCalled();
    buttons[1].nativeElement.click();
    expect(modalRef.close).toHaveBeenCalledWith(TestChoices.chooseB);
    spyClose.calls.reset();

    expect(modalRef.close).not.toHaveBeenCalled();
    buttons[2].nativeElement.click();
    expect(modalRef.close).toHaveBeenCalledWith(TestChoices.chooseC);
    spyClose.calls.reset();
  });

});

