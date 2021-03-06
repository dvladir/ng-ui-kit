import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PaginationComponent} from './pagination.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

const DISABLED = 'disabled';

const getContent = (fixture: ComponentFixture<PaginationComponent>) => {

  const element: HTMLElement = fixture.nativeElement as HTMLElement;
  const btnFirst = element.querySelector('.t_btn-first');
  const btnPrev = element.querySelector('.t_btn-prev');
  const btnNext = element.querySelector('.t_btn-next');
  const btnLast = element.querySelector('.t_btn-last');
  const leftOffset = element.querySelector('.t_left-offset');
  const rightOffset = element.querySelector('.t_right-offset');
  const items = element.querySelectorAll('.t_item');
  const activeItem = element.querySelector('.t_item.active');

  return {
    btnFirst,
    btnPrev,
    btnLast,
    btnNext,
    leftOffset,
    rightOffset,
    items,
    activeItem
  };
};

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
    expect(component.count).toBe(0);
    expect(component.current).toBe(0);
    expect(component.limit).toBe(5);

    const x = getContent(fixture);
    expect(x.btnFirst).not.toBeNull();
    expect(x.btnFirst!.classList.contains(DISABLED)).toBeTrue();
    expect(x.btnPrev).not.toBeNull();
    expect(x.btnPrev!.classList.contains(DISABLED)).toBeTrue();
    expect(x.btnNext).not.toBeNull();
    expect(x.btnNext!.classList.contains(DISABLED)).toBeTrue();
    expect(x.btnLast).not.toBeNull();
    expect(x.btnLast!.classList.contains(DISABLED)).toBeTrue();
    expect(x.leftOffset).toBeNull();
    expect(x.rightOffset).toBeNull();
    expect(x.activeItem).toBeNull();
    expect(x.items.length).toBe(0);
  });

  it('limit change', () => {
    component.count = 10;
    fixture.detectChanges();

    let x = getContent(fixture);
    expect(x.items.length).toBe(5);
    expect(x.leftOffset).toBeNull();
    expect(x.rightOffset).not.toBeNull();

    component.current = 5;
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.items.length).toBe(5);
    expect(x.leftOffset).not.toBeNull();
    expect(x.rightOffset).not.toBeNull();

    component.goLast();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.items.length).toBe(5);
    expect(x.leftOffset).not.toBeNull();
    expect(x.rightOffset).toBeNull();

    component.current = 5;
    component.limit = 10;
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.items.length).toBe(10);
    expect(x.leftOffset).toBeNull();
    expect(x.leftOffset).toBeNull();
  });

  it('navigation change', () => {
    component.count = 10;
    fixture.detectChanges();

    let x = getContent(fixture);
    expect(x.btnFirst!.classList.contains(DISABLED)).toBeTrue();
    expect(x.btnPrev!.classList.contains(DISABLED)).toBeTrue();
    expect(x.btnNext!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnLast!.classList.contains(DISABLED)).toBeFalse();
    expect(x.activeItem!.textContent).toEqual('1');
    expect(component.current).toBe(0);

    x.btnNext!.querySelector('a')!.click();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.btnFirst!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnPrev!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnNext!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnLast!.classList.contains(DISABLED)).toBeFalse();
    expect(x.activeItem!.textContent).toEqual('2');
    expect(component.current).toBe(1);

    x.btnLast!.querySelector('a')!.click();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.btnFirst!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnPrev!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnNext!.classList.contains(DISABLED)).toBeTrue();
    expect(x.btnLast!.classList.contains(DISABLED)).toBeTrue();
    expect(x.activeItem!.textContent).toEqual('10');
    expect(component.current).toBe(9);

    x.btnPrev!.querySelector('a')!.click();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.btnFirst!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnPrev!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnNext!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnLast!.classList.contains(DISABLED)).toBeFalse();
    expect(x.activeItem!.textContent).toEqual('9');
    expect(component.current).toBe(8);

    component.goToPage(4);
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.btnFirst!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnPrev!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnNext!.classList.contains(DISABLED)).toBeFalse();
    expect(x.btnLast!.classList.contains(DISABLED)).toBeFalse();
    expect(x.activeItem!.textContent).toEqual('5');
    expect(component.current).toBe(4);
  });

  it('Event emition', () => {
    const spyEmit = spyOn(component.currentChange, 'emit');

    component.count = 10;
    fixture.detectChanges();

    const x = getContent(fixture);
    expect(component.current).toBe(0);
    expect(component.currentChange.emit).not.toHaveBeenCalled();

    x.btnNext!.querySelector('a')!.click();
    fixture.detectChanges();

    expect(component.current).toBe(1);
    expect(component.currentChange.emit).toHaveBeenCalledWith(1);

    component.isCurrentPageAutoUpdate = false;
    x.btnNext!.querySelector('a')!.click();
    fixture.detectChanges();

    expect(component.current).toBe(1);
    expect(component.currentChange.emit).toHaveBeenCalledWith(2);
  });

  it('Check methods', () => {
    const spyGoToPage = spyOn(component, 'goToPage');
    component.count = 10;

    spyGoToPage.calls.reset();
    component.goPrevious();
    expect(component.goToPage).not.toHaveBeenCalled();

    spyGoToPage.calls.reset();
    component.goFirst();
    expect(component.goToPage).not.toHaveBeenCalled();

    component.current = 2;

    spyGoToPage.calls.reset();
    component.goPrevious();
    expect(component.goToPage).toHaveBeenCalledWith(1);

    spyGoToPage.calls.reset();
    component.goFirst();
    expect(component.goToPage).toHaveBeenCalledWith(0);

    component.current = 9;

    spyGoToPage.calls.reset();
    component.goNext();
    expect(component.goToPage).not.toHaveBeenCalled();

    spyGoToPage.calls.reset();
    component.goLast();
    expect(component.goToPage).not.toHaveBeenCalled();

    component.current = 7;

    spyGoToPage.calls.reset();
    component.goNext();
    expect(component.goToPage).toHaveBeenCalledWith(8);

    spyGoToPage.calls.reset();
    component.goLast();
    expect(component.goToPage).toHaveBeenCalledWith(9);

  });

});
