import {TestBed} from '@angular/core/testing';

import {ToastService} from './toast.service';
import {MockTnsHelper} from '../../translations/services/mock-tns-helper';
import {ToastLogicMockService} from './toast-logic.mock.service';
import {MessageType} from '../shared/message-type.enum';
import {ToastLogicService} from '../services/toast-logic.service';
import {TranslationHelperService} from '../../translations/services/translation-helper.service';

describe('ToastService', () => {
  let service: ToastService;
  let logic: ToastLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: TranslationHelperService, useClass: MockTnsHelper},
        {provide: ToastLogicService, useClass: ToastLogicMockService}
      ]
    });
    service = TestBed.inject(ToastService);
    logic = TestBed.inject(ToastLogicService);
  });

  it('Typed message', () => {
    spyOn(logic, 'addMessage').and.callThrough();
    expect(logic.addMessage).not.toHaveBeenCalled();

    service.typedMessage(MessageType.ok, 'test', 'TEST');

    expect(logic.addMessage).toHaveBeenCalledWith({
      messageType: MessageType.ok,
      text: 'Test test test'
    });

  });

  it('Error message', () => {
    spyOn(service, 'typedMessage').and.callThrough();
    expect(service.typedMessage).not.toHaveBeenCalled();
    service.errorMessage('test', 'TEST');
    expect(service.typedMessage).toHaveBeenCalledWith(MessageType.err, 'test', 'TEST');
  });

  it('Ok message', () => {
    spyOn(service, 'typedMessage').and.callThrough();
    expect(service.typedMessage).not.toHaveBeenCalled();
    service.okMessage('test', 'TEST');
    expect(service.typedMessage).toHaveBeenCalledWith(MessageType.ok, 'test', 'TEST');
  });


  it('Info message', () => {
    spyOn(service, 'typedMessage').and.callThrough();
    expect(service.typedMessage).not.toHaveBeenCalled();
    service.infoMessage('test', 'TEST');
    expect(service.typedMessage).toHaveBeenCalledWith(MessageType.info, 'test', 'TEST');
  });

  it('Warn message', () => {
    spyOn(service, 'typedMessage').and.callThrough();
    expect(service.typedMessage).not.toHaveBeenCalled();
    service.warnMessage('test', 'TEST');
    expect(service.typedMessage).toHaveBeenCalledWith(MessageType.warn, 'test', 'TEST');
  });


});
