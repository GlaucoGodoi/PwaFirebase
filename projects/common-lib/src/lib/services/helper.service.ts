import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';
import { CameraInputComponent } from '../components/camera-input/camera-input.component';
import { AlertData } from '../dto/alert-data';
import { AlertResponseEnum } from '../enums/alert-response-enum';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) { }

  public async displayDialog(data: AlertData): Promise<AlertResponseEnum> {
    return new Promise<AlertResponseEnum>((resolve, reject) => {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: data,
        hasBackdrop: true,
        autoFocus: true,
        panelClass: 'alert-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result: AlertResponseEnum) => {
        resolve(result);
      });
    });
  }


  public async displayCamera(): Promise<AlertResponseEnum> {
    return new Promise<AlertResponseEnum>((resolve, reject) => {
      const dialogRef = this.dialog.open(CameraInputComponent, {        
        hasBackdrop: true,
        
        maxWidth: '100vw!important',
        autoFocus: true,        
        panelClass: 'camera-dialog-container',
      } as MatDialogConfig<CameraInputComponent>);

      dialogRef.afterClosed().subscribe((result: AlertResponseEnum) => {
        resolve(result);
      });
    });
  }

  public snackBarConfig: MatSnackBarConfig = { duration: 2500, verticalPosition: 'bottom' } as MatSnackBarConfig;

  public showSnackBar(message: string, config: MatSnackBarConfig | null = null): void  {
    this.snack.open(message, '', config || this.snackBarConfig);
  }

}
