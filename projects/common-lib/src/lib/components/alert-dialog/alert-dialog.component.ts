import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertData } from '../../dto/alert-data';
import { AlertResponseEnum } from '../../enums/alert-response-enum';

@Component({
  selector: 'lib-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogComponent implements OnInit {

  constructor(
    @Optional() public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData
  ) { }

  ngOnInit(): void {
  }

  public onNoClick(): void {
    this.dialogRef.close(AlertResponseEnum.NO);
  }

  public onYesClick(): void {
    this.dialogRef.close(AlertResponseEnum.YES);
  }

  public onOkClick(): void {
    this.dialogRef.close(AlertResponseEnum.OK);
  }

}
