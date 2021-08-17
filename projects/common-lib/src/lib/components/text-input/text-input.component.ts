import { coerceBooleanProperty, coerceNumberProperty } from "@angular/cdk/coercion";
import { Component, Input } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
  selector: 'lib-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  providers: [

  ]
})
export class TextInputComponent {

  @Input()
  public label!: string;

  @Input()
  public hint!: string;

  public readonly maxValue = Number.MAX_VALUE;
  public localMaxLen: number = this.maxValue;
  @Input()
  public set maxLen(value: string) {
    this.localMaxLen = coerceNumberProperty(value);
  }

  public localMinLen!: number;
  @Input()
  public set minLen(value: string) {
    this.localMinLen = coerceNumberProperty(value);
  }

  public theControl!: FormControl;
  @Input()
  public set formElement(ctrl: AbstractControl) {
    this.theControl = ctrl as FormControl;
  }

  public localRequired!: boolean;
  @Input()
  public set required(value: string) {
    this.localRequired = coerceBooleanProperty(value);
  }

  public localReadonly!: boolean;
  @Input()
  public set readonly(value: string) {
    this.localReadonly = coerceBooleanProperty(value);
  }
}