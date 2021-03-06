import {TestBed} from '@angular/core/testing';

import {ModalService} from './modal.service';
import {ButtonDescription} from '../shared/button-description';
import {MultiChoiceModalData} from '../shared/multi-choice-modal-data';
import {Choice} from '../../../_common/choices.enum';
import {CoreModule} from '../../../core.module';
import {MultiChoiceModalComponent} from '../components/multi-choice-modal/multi-choice-modal.component';
import {ModalOptions} from '../shared/modal-options';
import {OverlayModule} from '@angular/cdk/overlay';

enum TestChoices {
  chooseA = 'chooseA',
  chooseB = 'chooseB',
  chooseC = 'chooseC'
}

const mockMultiChoice: MultiChoiceModalData<TestChoices> = {
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
};

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        CoreModule
      ],
      providers: [
        ModalService
      ]
    });
    service = TestBed.inject(ModalService);
  });

  it('Open multi choice', () => {
    spyOn(service, 'open');
    expect(service.open).not.toHaveBeenCalled();

    const expectModalOptions: Partial<ModalOptions<MultiChoiceModalData<TestChoices>, TestChoices>> = {
      data: mockMultiChoice,
      defaultResult: TestChoices.chooseA,
      showCloseButton: false,
    };

    service.openMultiChoice(mockMultiChoice);
    expect(service.open).toHaveBeenCalledWith(MultiChoiceModalComponent, expectModalOptions);
  });

  it('Open multi confirm', () => {
    spyOn(service, 'openMultiChoice');
    expect(service.openMultiChoice).not.toHaveBeenCalled();

    const view = 'YES_NO_CANCEL';
    const buttons: ButtonDescription<Choice>[] = [
      {caption: {message: 'yes',    view}, value: Choice.yes,    btnClass: 'btn btn-primary'},
      {caption: {message: 'no',     view}, value: Choice.no,     btnClass: 'btn btn-danger'},
      {caption: {message: 'cancel', view}, value: Choice.cancel, btnClass: 'btn btn-outline-secondary', isDefault: true}
    ];

    const message = 'foo';

    service.openMultiConfirm(message);
    expect(service.openMultiChoice).toHaveBeenCalledWith({message, buttons});
  });

  it('Open confirm', () => {
    spyOn(service, 'openMultiChoice').and.resolveTo(Choice.yes);
    expect(service.openMultiChoice).not.toHaveBeenCalled();

    const view = 'YES_NO_CANCEL';
    const buttons: ButtonDescription<Choice>[] = [
      {caption: {message: 'yes',    view}, value: Choice.yes,    btnClass: 'btn btn-primary'},
      {caption: {message: 'no',     view}, value: Choice.no,     btnClass: 'btn btn-outline-secondary', isDefault: true}
    ];

    const message = 'foo';

    service.openConfirm(message);
    expect(service.openMultiChoice).toHaveBeenCalledWith({message, buttons});
  });
});
