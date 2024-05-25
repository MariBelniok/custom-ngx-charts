import { InjectOptions, InjectionToken, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ButtonState = 'enabled' | 'disabled';

export interface ButtonStateController {
  state: BehaviorSubject<ButtonState>;
}

export const BUTTON_STATE_CONTROLLER: InjectionToken<ButtonStateController> =
  new InjectionToken('BUTTON_STATE_CONTROLLER');

export const injectButtonStateController = (options: InjectOptions) =>
  inject(BUTTON_STATE_CONTROLLER, options);
