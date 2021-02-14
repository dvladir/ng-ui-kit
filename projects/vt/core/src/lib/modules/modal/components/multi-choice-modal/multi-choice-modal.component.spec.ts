import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChoiceModalComponent } from './multi-choice-modal.component';

describe('MultiChoiceModalComponent', () => {
  let component: MultiChoiceModalComponent;
  let fixture: ComponentFixture<MultiChoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiChoiceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
