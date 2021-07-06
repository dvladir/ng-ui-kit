import {animate, group, state, style, transition, trigger} from '@angular/animations';

const beforeAdd = {bottom: '-4rem'};
const afterAdd  = {bottom: '0rem'  };

const opacityZero = {opacity: 0};
const opacityOne = {opacity: 1};
const translateZero = {transform: 'translate(0, 0)'};
const translateTop = {transform: 'translate(0, 8rem)'};
const translateRight = {transform: 'translate(8rem, 0)'};

const timing1 = '.3s .1s ease';
const timing2 = '.3s ease';

export const container = trigger('container', [
  state('beforeAdd', style(beforeAdd)),
  state('afterAdd', style(afterAdd)),
  transition('afterAdd => beforeAdd', [
    style(beforeAdd),
    animate(timing1, style(afterAdd))
  ])
]);

export const flyIn = trigger('flyIn', [
  state('in', style({...translateZero, ...opacityOne})),
  transition('void => *', [
    style({...translateTop, ...opacityZero}),
    group([
      animate(timing1, style(translateZero)),
      animate(timing2, style(opacityOne)),
    ])
  ])
]);

export const flyOut = trigger('flyOut', [
  state('out', style({...translateZero, ...opacityOne})),
  transition('* => void', [
    group([
      animate(timing1, style(translateRight)),
      animate(timing2, style(opacityOne)),
    ])
  ])
]);
