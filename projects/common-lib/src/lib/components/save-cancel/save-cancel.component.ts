import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-save-cancel',
  templateUrl: './save-cancel.component.html',
  styleUrls: ['./save-cancel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveCancelComponent{

  @Input()
  public isBusy: boolean = false;

  @Input()
  public allowSave: boolean = false;

  @Input()
  public allowCancel: boolean = true;

  @Output() 
  public onCancel = new EventEmitter<void>();

  @Output() 
  public onSave = new EventEmitter<void>();

  public handleCancel(): void{    
    this.onCancel.emit();
  }

  public handleSave(): void{
    this.onSave.emit();
  }
}
