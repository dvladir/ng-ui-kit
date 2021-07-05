import {Type} from '@angular/core';
import {AbstractControl, AbstractControlOptions, FormArray, FormGroup} from '@angular/forms';

export type KeyMap<T> = {[key in keyof T]: string};

export const generateFieldNames = <T extends object>(type: Type<T>): KeyMap<T> => {
  const result = (Object.keys(new type()) as (keyof T)[]).reduce((res: KeyMap<T>, key: keyof T) => {
    res[key] = key.toString();
    return res;
  }, {} as KeyMap<T>);
  return result;
}

export type TypedFormConfig<T> = Record<keyof T, AbstractControlOptions>;

export type TypedFormGroup<T> = {
  controls: Record<keyof T, AbstractControl>,
  value: T
} & FormGroup;

export type TypedFormArray<T> = {
  controls: TypedFormGroup<T>;
  value: T[]
} & FormArray;
