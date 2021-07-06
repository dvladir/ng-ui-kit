import {Component, EventEmitter, HostListener, Input, Output, TrackByFunction} from '@angular/core';
import { DvMessage } from '../../../translations/shared/dv-message';

interface Openable {
  isOpen: boolean;
}

@Component({
  selector: 'dv-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent {

  readonly isOpen: boolean = false;

  readonly trackByFn: TrackByFunction<{key: string}> = (index, item) => item.key;

  @Input() items: ReadonlyArray<{key: string, label: DvMessage}> = [];

  @Output() chooseAction: EventEmitter<string> = new EventEmitter<string>();

  openList(): void {
    (this as Openable).isOpen = true;
  }

  choose(key: string): boolean {
    (this as Openable).isOpen = false;
    this.chooseAction.emit(key);
    return false;
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    const t = event.target as HTMLElement;
    const check = 'invoke-container';
    if (
      t.classList.contains(check) ||
      (
        !!t.parentElement &&
        t.parentElement.classList.contains(check)
      )
    ) {
      return;
    }

    (this as Openable).isOpen = false;
  }

}
