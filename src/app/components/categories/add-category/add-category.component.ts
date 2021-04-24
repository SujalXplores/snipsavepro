import { Component, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  categoryForm: FormGroup;
  private unsubscribe = new Subject();
  constructor(
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fireStore: AngularFirestore,
    private toast: HotToastService,
    private _auth: AngularFireAuth
  ) {
    this.categoryForm = new FormGroup({
      c_name: new FormControl(null, [Validators.required]),
    });
  }

  newCategory(): void {
    if(this.categoryForm.valid) {
      const c_data = {
        "c_name": this.categoryForm.value.c_name,
        "date": new Date().toLocaleDateString()
      };
      this._auth.authState.pipe(takeUntil(this.unsubscribe)).subscribe((user)=>{
        this._fireStore.collection('categories' + user.email).add(c_data).then(() => {
          this.toast.success(c_data.c_name + " Added to Category", {
            theme: 'snackbar',
            id: 'category',
            position: 'bottom-center'
          });
          this.dialogRef.close();
        }).catch(() => {
          this.toast.warning("Something went wrong !", {
            id: 'wrong',
            theme: 'snackbar',
            position: 'bottom-center'
          });
        });
      });
    } else {
      this.toast.error("Invalid category", {
        id: 'wrong',
        theme: 'snackbar',
        position: 'bottom-center'
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
