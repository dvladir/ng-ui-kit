import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValueStoreService {
  selectedValue?: string;
  selectedValueAll?: string;
  selectedUserId?: number;

  phone?: string;
  phone2?: string;
  email?: string;
  year?: number;
}
