import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private _router: Router,
    private dialogRef: MatDialogRef<LogoutComponent>
  ) { }

  onConfirmExit() {
    this.dialogRef.close(true);
    this._router.navigate(['']);
    localStorage.clear();
  }
}
