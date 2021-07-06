import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * todo: Probably instead of this service, it should be some kind of
 * complicated configuration service, which allows to configure the library
 */
export class IndicatorIconSetupService {

  readonly indicatorIcon: string = 'fa-dharmachakra';

  setup(iconClass: string): void {
    (this as {indicatorIcon: string}).indicatorIcon = iconClass;
  }
}
