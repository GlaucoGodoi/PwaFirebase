import { FocusMonitor } from "@angular/cdk/a11y";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators } from "@angular/forms";
import { MatFormField, MatFormFieldControl, MAT_FORM_FIELD } from "@angular/material/form-field";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: 'lib-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
  providers: [{ provide: MatFormFieldControl, useExisting: DateInputComponent }],
  host: {
    '[class.lib-date-input-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateInputComponent implements ControlValueAccessor, MatFormFieldControl<Date>, OnInit, OnDestroy {

  private static nextId = 0;
  private readonly componentSelector = `lib-date-input`;

  public static ngAcceptInputType_disabled: BooleanInput;
  public static ngAcceptInputType_required: BooleanInput
  public internalForm!: FormGroup;
  public stateChanges = new Subject<void>();
  public focused = false;
  public touched = false;
  public controlType = this.componentSelector;
  public id = `${this.componentSelector}-${DateInputComponent.nextId++}`;
  public onChange = (_: any) => { };
  public onTouched = () => { };


  @Input('aria-describedby')
  public userAriaDescribedBy!: string;

  @Input()
  public hint!: string;

  public localUseTime!: boolean;
  @Input()
  public set usetime(value: string) {
    this.localUseTime = coerceBooleanProperty(value);
  }

  public localReadonly!: boolean;
  @Input()
  public set readonly(value: string) {
    this.localReadonly = coerceBooleanProperty(value);
  }
  public localUseTen!: boolean;
  @Input()
  public set usetenminutes(value: string) {
    this.localUseTen = coerceBooleanProperty(value);
  }

  public get empty() {
    if (this.localUseTime) {
      return !this.date.value && !this.hour.value && !this.minute.value;
    } else {
      return !this.date.value;
    }
  }

  public get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.date.setValidators(this.required ? [Validators.required] : []);
    if (this.localUseTime) {
      this.hour.setValidators(this.required ? [Validators.required] : []);
      this.minute.setValidators(this.required ? [Validators.required] : []);
    }
    this.stateChanges.next();
  }

  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.internalForm.disable() : this.internalForm.enable();
    this.stateChanges.next();
  }

  @Input()
  public get value(): Date | null {
    const ret = this.assembleDate();
    return ret;
  }
  public set value(newDate: Date | null) {

    this.date.setValue(newDate);

    if (this.localUseTime) {
      this.hour.setValue(newDate?.getHours());
      if (this.localUseTen) {
        this.minute.setValue(this.getNearestTen(newDate));
      } else {
        this.minute.setValue(newDate?.getMinutes());
      }
    }

    this.stateChanges.next();
  }

  public get errorState(): boolean {
    return this.internalForm.invalid && this.touched;
  }


  @ViewChild('dateField')
  private datepicker!: HTMLInputElement;

  private _placeholder!: string;
  private _required = false;
  private _disabled = false;

  private subs = new Array<Subscription>();

  constructor(
    private fb: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {


    this.internalForm = this.fb.group({
      date: [null],
      hour: [null],
      minute: [null]
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this.subs.push(this.internalForm.valueChanges.subscribe(() => {
      const date = this.assembleDate();
      this.onChange(date);
    }));
  }

  public ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  public onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  public onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  public autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement
      .querySelector(this.componentSelector)!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  public autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  public onContainerClick() {
    if (this.internalForm.controls.subscriber.valid) {
      this._focusMonitor.focusVia(this.datepicker, 'program');
    } else if (this.internalForm.controls.exchange.valid) {
      this._focusMonitor.focusVia(this.datepicker, 'program');
    } else if (this.internalForm.controls.area.valid) {
      this._focusMonitor.focusVia(this.datepicker, 'program');
    } else {
      this._focusMonitor.focusVia(this.datepicker, 'program');
    }
  }

  public writeValue(newDate: Date | null): void {
    this.value = newDate;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }


  public get date(): AbstractControl {
    return this.internalForm.controls['date'];
  }

  public get hour(): AbstractControl {
    return this.internalForm.controls['hour'];
  }

  public get minute(): AbstractControl {
    return this.internalForm.controls['minute'];
  }

  private assembleDate(): Date | null {
    let ret!: Date;
    if (!this.date.value) {
      return null;
    }

    if (!this.localUseTime) {
      ret = this.date.value;
    } else {
      const day = this.date.value?.day || 1;
      const month = this.date.value?.month || 1;
      const year = this.date.value?.year || 1900;
      const hour = this.hour?.value || 0;
      const minute = this.minute?.value || 0;
      const newDate = new Date(year, month, day, hour, minute);
      ret = newDate;
    }
    return ret;
  }

  private getNearestTen(value: Date | null): number {
    if(value===null){
      return 0;
    }
    const coefficient = 1000 * 60 * 10; //Select only 10 minutes
    const rounded = new Date(Math.round(value.getTime() / coefficient) * coefficient)
    const minutes = rounded.getMinutes();
    return minutes;
  }


}

/////////////////////////////////////////////////////////////////////





// import { coerceBooleanProperty } from "@angular/cdk/coercion";
// import { forwardRef } from "@angular/core";
// import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
// import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { Subscription } from "rxjs";
// import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


// @Component({
//   selector: 'lib-date-input',
//   templateUrl: './date-input.component.html',
//   styleUrls: ['./date-input.component.css'],
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => DateInputComponent),
//       multi: true,
//     },
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class DateInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

//   public onCHange: any = () => { };
//   public onTouch: any = () => { };

//   public val!: any;
//   public set value(value: any) {
//     this.val = value;
//     this.onCHange(value);
//     this.onTouch(value);
//     console.log(value);
//   }
//   public get value(): Date | null {
//     return this.val;
//   }

//   public setDisabledState(isDisabled: boolean): void {
//     if (isDisabled) {
//       this.internalForm.disable();
//     } else {
//       this.internalForm.enable();
//     }    
//   }

//   public writeValue(value: any): void {
//     this.value = value;    

//     if (value) {
//       let minutes = value.getMinutes();
//       if (this.localUseTen) {
//         const coefficient = 1000 * 60 * 10; //Select only 10 minutes
//         const rounded = new Date(Math.round(value.getTime() / coefficient) * coefficient)
//         minutes = rounded.getMinutes();
//       }
//       this.internalForm.patchValue({ date: value, hour: value.getHours(), minute: minutes });
//     }
//   }

//   public registerOnChange(fn: any): void {
//     this.onCHange = fn;
//   }

//   public registerOnTouched(fn: any): void {
//     this.onTouch = fn;
//   }

//   @Output()
//   public dateChange: EventEmitter<Date> = new EventEmitter<Date>();

//   @Input()
//   public label!: string;

//   @Input()
//   public hint!: string;


//   @Input()
//   public required!: string


//   public localReadonly!: boolean;
//   @Input()
//   public set readonly(value: string) {
//     this.localReadonly = coerceBooleanProperty(value);
//   }

//   public localUseTime!: boolean;
//   @Input()
//   public set usetime(value: string) {
//     this.localUseTime = coerceBooleanProperty(value);
//   }

//   public localUseTen!: boolean;
//   @Input()
//   public set usetenminutes(value: string) {
//     this.localUseTen = coerceBooleanProperty(value);
//   }

//   public internalForm!: FormGroup;

//   private subs = new Array<Subscription>();

//   constructor(
//     private fb: FormBuilder
//   ) { }

//   public ngOnInit(): void {
//     this.internalForm = this.fb.group({
//       date: [null],
//       hour: [null],
//       minute: [null],
//     });

//     this.subs.push(
//       this.internalForm.valueChanges.subscribe(data => {        
//         this.dateChange.emit(data);
//         if (!this.localUseTime) {

//           this.val = data.date;
//         } else {

//           const day = data.date?.day || 1;
//           const month = data.date?.month || 1;
//           const year = data.date?.year || 1900;
//           const hour = data?.hour || 0;
//           const minute = data?.minute || 0;
//           const newDate = new Date(year, month, day, hour, minute);
//           this.val = newDate;
//           this.onCHange(newDate);
//         }
//       }));

//       this.internalForm.controls['date'].setValidators(this.required==='true' ? [Validators.required] : []);
//   }

//   public ngOnDestroy(): void {
//     this.subs.forEach(s => s.unsubscribe());
//   }

//   public get date (): AbstractControl  { 
//     return this.internalForm.controls['date'];
//   }

//   public get hour (): AbstractControl  {
//     return this.internalForm.controls['hour'];
//   }

//   public get minute (): AbstractControl  {
//     return this.internalForm.controls['minute'];
//   }
// }