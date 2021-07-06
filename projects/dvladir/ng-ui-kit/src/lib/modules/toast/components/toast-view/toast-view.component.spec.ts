import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastViewComponent} from './toast-view.component';
import {ToastLogicService} from '../../services/toast-logic.service';
import {ToastLogicMockService} from '../../services/toast-logic.mock.service';
import {Message} from '../../shared/message';
import {MessageType} from '../../shared/message-type.enum';

describe('ToastViewComponent', () => {
  let logic: ToastLogicService;
  let component: ToastViewComponent;
  let fixture: ComponentFixture<ToastViewComponent>;

  const setMessages = (...messages: Message[]) => (logic as unknown as ToastLogicMockService).messages$.next(messages);
  const getAlerts = () =>  (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLDivElement>('.alert');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ ToastViewComponent ],
      providers: [{
        provide: ToastLogicService,
        useClass: ToastLogicMockService
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastViewComponent);
    logic = TestBed.inject(ToastLogicService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Show message', () => {
    let alerts = getAlerts();
    expect(alerts.length).toBe(0);
    setMessages(
      {messageType: MessageType.ok, text: 'ok'},
      {messageType: MessageType.info, text: 'info'},
      {messageType: MessageType.warn, text: 'warn'},
      {messageType: MessageType.err,  text: 'err'},
    );
    fixture.detectChanges();
    alerts = getAlerts();
    expect(alerts.length).toBe(4);

    expect(alerts.item(0).classList.contains('alert-success')).toBeTrue();
    expect(alerts.item(1).classList.contains('alert-info')).toBeTrue();
    expect(alerts.item(2).classList.contains('alert-warning')).toBeTrue();
    expect(alerts.item(3).classList.contains('alert-danger')).toBeTrue();

    expect(alerts.item(0).querySelector('div')!.innerText).toBe('ok');
    expect(alerts.item(1).querySelector('div')!.innerText).toBe('info');
    expect(alerts.item(2).querySelector('div')!.innerText).toBe('warn');
    expect(alerts.item(3).querySelector('div')!.innerText).toBe('err');
  });

  it('Remove invoke', () => {
    spyOn(logic, 'removeMessage');
    let alerts = getAlerts();

    expect(alerts.length).toBe(0);
    setMessages(
      {messageType: MessageType.ok, text: 'ok'},
    );
    fixture.detectChanges();
    alerts = getAlerts();
    expect(alerts.length).toBe(1);

    const alertRemoveSpan = alerts.item(0).querySelector<HTMLElement>('.alert__remove')!;
    expect(logic.removeMessage).not.toHaveBeenCalled();
    alertRemoveSpan.click();
    expect(logic.removeMessage).toHaveBeenCalledWith({messageType: MessageType.ok, text: 'ok'});
  });

});
