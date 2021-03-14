import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValueStoreService {
  selectedValue?: string;
  selectedUserId?: number;
}
