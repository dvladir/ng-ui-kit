import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ModalDialogComponent} from './modal-dialog.component';
import {ModalRef} from '../../shared/modal-ref';
import {CaptionComponent} from '../../../translations/components/caption/caption.component';
import {ModalBodyComponent} from '../modal-body/modal-body.component';
import {ModalFooterComponent} from '../modal-footer/modal-footer.component';
import {ModalHeaderComponent} from '../modal-header/modal-header.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

let showCloseButtonValue: boolean = true;

const mockRef: ModalRef<number, string> = {
  data: 42,
  get showCloseButton(): boolean {
    return showCloseButtonValue;
  },
  close(result?: string): void {
  }
};

@Component({
  selector: 'vtc-test-dialog',
  template: `
    <vtc-modal-dialog [headerCaption]="headerCaption">
      <vtc-modal-header>
        <span class="t-header" *ngIf="headerContent">{{headerContent}}</span>
      </vtc-modal-header>
      <vtc-modal-body>
        <span class="t-body" *ngIf="bodyContent">{{bodyContent}}</span>
      </vtc-modal-body>
      <vtc-modal-footer>
        <span class="t-footer" *ngIf="footerContent">{{footerContent}}</span>
      </vtc-modal-footer>
    </vtc-modal-dialog>
  `
})
class MockModalDialogComponent {
  constructor(
    public ref: ModalRef
  ) {
  }

  headerCaption: string = '';
  headerContent: string = '';
  bodyContent: string = '';
  footerContent: string = '';
}

describe('ModalDialogComponent', () => {
  let component: MockModalDialogComponent;
  let fixture: ComponentFixture<MockModalDialogComponent>;

  const getLayout = () => {
    const el = fixture.nativeElement as HTMLElement;
    const header = el.querySelector<HTMLDivElement>('.modal-header')!;
    const body = el.querySelector<HTMLDivElement>('.modal-body')!;
    const footer = el.querySelector<HTMLDivElement>('.modal-footer')!;
    return {header, body, footer};
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CaptionComponent,
        ModalDialogComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        MockModalDialogComponent
      ],
      providers: [
        {
          provide: ModalRef,
          useValue: mockRef
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Header content visibility', () => {
    component.headerContent = 'HEADER CONTENT';
    fixture.detectChanges();

    let layout = getLayout();
    let span = layout.header.querySelector<HTMLSpanElement>('.t-header');
    expect(span).not.toBeNull();
    expect(span!.textContent).toEqual('HEADER CONTENT');

    component.headerContent = '';
    fixture.detectChanges();

    layout = getLayout();
    span = layout.header.querySelector<HTMLSpanElement>('.t-header');
    expect(span).toBeNull();
  });

  it('Body content visibility', () => {
    component.bodyContent = 'BODY CONTENT';
    fixture.detectChanges();

    let layout = getLayout();
    let span = layout.body.querySelector<HTMLSpanElement>('.t-body');
    expect(span).not.toBeNull();
    expect(span!.textContent).toEqual('BODY CONTENT');

    component.bodyContent = '';
    fixture.detectChanges();

    layout = getLayout();
    span = layout.body.querySelector<HTMLSpanElement>('.t-body');
    expect(span).toBeNull();
  });

  it('Footer content visibility', () => {
    component.footerContent = 'FOOTER CONTENT';
    fixture.detectChanges();

    let layout = getLayout();
    let span = layout.footer.querySelector<HTMLSpanElement>('.t-footer');
    expect(span).not.toBeNull();
    expect(span!.textContent).toEqual('FOOTER CONTENT');

    component.footerContent = '';
    fixture.detectChanges();

    layout = getLayout();
    span = layout.footer.querySelector<HTMLSpanElement>('.t-footer');
    expect(span).toBeNull();
  });

  it('Header caption', () => {
    component.headerContent = 'HEADER CONTENT';
    fixture.detectChanges();

    let layout = getLayout();
    let span = layout.header.querySelector<HTMLSpanElement>('.t-header');
    expect(span).not.toBeNull();
    let caption = fixture.debugElement.query(By.directive(CaptionComponent));
    expect(caption).toBeNull();

    component.headerCaption = 'foo';
    fixture.detectChanges();
    layout = getLayout();
    span = layout.header.querySelector<HTMLSpanElement>('.t-header');
    expect(span).toBeNull();
    caption = fixture.debugElement.query(By.directive(CaptionComponent));
    expect(caption).not.toBeNull();
    expect(caption.componentInstance.value).toBe('foo');
  });

  it('Close button', () => {
    spyOn(mockRef, 'close').and.callThrough();
    expect(mockRef.close).not.toHaveBeenCalled();
    let layout = getLayout();
    let btn = layout.header.querySelector<HTMLButtonElement>('button.close');
    expect(btn).not.toBeNull();
    btn!.click();
    expect(mockRef.close).toHaveBeenCalled();

    showCloseButtonValue = false;
    fixture.detectChanges();
    layout = getLayout();
    btn = layout.header.querySelector<HTMLButtonElement>('button.close');
    expect(btn).toBeNull();
  });
});
