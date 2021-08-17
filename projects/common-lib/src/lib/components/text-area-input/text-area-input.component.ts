import { coerceBooleanProperty, coerceNumberProperty } from "@angular/cdk/coercion";
import { Component, Input } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
  selector: 'lib-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrls: ['./text-area-input.component.css'],
  providers: [
    
  ]
})
export class TextAreaInputComponent {

  @Input()
  public label!: string;

  @Input()
  public hint!: string;

  public readonly maxValue = Number.MAX_VALUE;
  public localMaxLen: number = this.maxValue;
  @Input()
  public set maxLen(value: string){
    this.localMaxLen = coerceNumberProperty(value);
  }

  public localMinLen!: number;
  @Input()
  public set minLen (value: string) {
    this.localMinLen = coerceNumberProperty(value);
  }

  public localRows: number = 2;
  @Input()
  public set rows (value: string) {
    this.localRows = coerceNumberProperty(value);
  }

  public theControl!: FormControl;
  @Input()
  public set formElement(ctrl: AbstractControl){
    this.theControl = ctrl as FormControl;
  }

  public localRequired!: boolean;
  @Input()
  public set required(value: string){
    this.localRequired = coerceBooleanProperty(value);
  }

}