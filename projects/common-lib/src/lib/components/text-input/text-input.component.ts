import { coerceBooleanProperty, coerceNumberProperty } from "@angular/cdk/coercion";
import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { InputTypeEnum } from "../../enums/input-type-enum";


@Component({
  selector: 'lib-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  providers: [

  ]
})
export class TextInputComponent {

  @ViewChild('thisField') ctrl!: HTMLInputElement;

  @Input()
  public label!: string;

  @Input()
  public hint!: string;

  public readonly maxValue = Number.MAX_SAFE_INTEGER;
  public localMaxLen: number = Number.MAX_SAFE_INTEGER;
  @Input()
  public set maxLen(value: string) {
    this.localMaxLen = coerceNumberProperty(value);
  }

  public localMinLen: number = 0;
  @Input()
  public set minLen(value: string) {
    this.localMinLen = coerceNumberProperty(value);
  }

  public theControl!: FormControl;
  @Input()
  public set formElement(ctrl: AbstractControl) {
    this.theControl = ctrl as FormControl;
  }

  public localRequired: boolean = false;
  @Input()
  public set required(value: string) {
    this.localRequired = coerceBooleanProperty(value);
  }

  public localReadonly: boolean = false;
  @Input()
  public set readonly(value: string) {
    this.localReadonly = coerceBooleanProperty(value);
  }

  public localInputType: string = InputTypeEnum.TEXT;
  @Input()
  public set inputType(value: InputTypeEnum) {
    this.localInputType = value;
    
  }

}