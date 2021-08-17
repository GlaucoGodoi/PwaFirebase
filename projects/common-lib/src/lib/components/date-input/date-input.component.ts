import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { AfterContentInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: 'lib-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DateInputComponent implements OnInit, OnDestroy, AfterContentInit {

  @Output()
  public dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @Input()
  public label!: string;

  @Input()
  public hint!: string;

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

  public localUseTime!: boolean;
  @Input()
  public set usetime(value: string) {
    this.localUseTime = coerceBooleanProperty(value);
  }

  public localUseTen!: boolean;
  @Input()
  public set usetenminutes(value: string) {
    this.localUseTen = coerceBooleanProperty(value);
  }

  private shouldDisable!: boolean;
  @Input()
  public set disabled(value: string) {
    this.shouldDisable = coerceBooleanProperty(value);
  }

  public internalForm!: FormGroup;

  private subs = new Array<Subscription>();

  constructor(
    private fb: FormBuilder
  ) { }
 
  public ngOnInit(): void {
    this.internalForm = this.fb.group({
      date: [null],
      hour: [null],
      minute: [null],
    });

    this.subs.push(
      this.internalForm.valueChanges.subscribe(data => {

        this.dateChange.emit(data);
        if (this.theControl) {
          if (!this.localUseTime) {
            this.theControl.setValue(data.date);
          } else {

            const day = data.date?.day || 1;
            const month = data.date?.month || 1;
            const year = data.date?.year || 1900;
            const hour = data?.hour || 0;
            const minute = data?.minute || 0;
            const newDate = new Date(year, month, day, hour, minute);
            this.theControl.setValue(newDate);
          }
        }

      }));

      if(this.shouldDisable) {
        this.internalForm.disable();
      } else {
        this.internalForm.enable();
      }
      
      
  }

  ngAfterContentInit(): void {
    console.log(this.theControl);
    
    if(this.theControl.value) {
      console.log(this.theControl.value);
      this.internalForm.patchValue({
        date: this.theControl.value,
        hour: this.theControl.value.getHours(),
        minute: this.theControl.value.getMinutes()
      });
    }
  }

  public ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}