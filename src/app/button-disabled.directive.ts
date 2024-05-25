import { Directive, forwardRef } from "@angular/core";
import { BUTTON_STATE_CONTROLLER, ButtonState } from "./button-state";
import { BehaviorSubject } from "rxjs";

@Directive({
  selector: '[appButtonDisabled]',
  host: {
    '(click)': 'toggleState()'
  },
  providers: [
    {
      provide: BUTTON_STATE_CONTROLLER,
      useExisting: forwardRef(() => ButtonDisabledDirective),
    },
  ],
  standalone: true,
})
export class ButtonDisabledDirective {
  state = new BehaviorSubject<ButtonState>('enabled');

  toggleState() {
    this.state.next(this.state.value === 'enabled'? 'disabled' : 'enabled');
  }
}
