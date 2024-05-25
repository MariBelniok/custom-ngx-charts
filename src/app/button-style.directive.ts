import { Directive, ElementRef, Renderer2, effect, inject } from "@angular/core";
import { BUTTON_STATE_CONTROLLER, injectButtonStateController } from "./button-state";
import { BehaviorSubject } from "rxjs";

@Directive({
  selector: '[appButton]',
  standalone: true,
  host: {
    class: 'btn'
  }
})
export class ButtonDirective {
  buttonState = injectButtonStateController({ self: true })
  state = this.buttonState?.state ?? new BehaviorSubject('disabled');

  constructor(private renderer: Renderer2, private element: ElementRef) {
    effect(() => {
      this.renderer.setAttribute(
        this.element.nativeElement,
        'button',
        this.state.value,
      )
    })
  }
}
