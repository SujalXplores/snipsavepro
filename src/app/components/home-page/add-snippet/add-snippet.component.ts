import { Component, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Categories } from '../../categories/categories.model';

@Component({
  selector: 'app-add-snippet',
  templateUrl: './add-snippet.component.html',
  styleUrls: ['./add-snippet.component.scss']
})
export class AddSnippetComponent {
  snippetForm: FormGroup;
  category_info: Categories[] = [];
  categoryControl = new FormControl(null, [Validators.required]);
  private unsubscribe = new Subject();
  email: string = '';
  constructor(
    private dialogRef: MatDialogRef<AddSnippetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fireStore: AngularFirestore,
    private toast: HotToastService,
    private _auth: AngularFireAuth
  ) {
    this._auth.authState.pipe(takeUntil(this.unsubscribe)).subscribe((user)=>{
      this.email = user.email;
      this._fireStore.collection("categories" + user.email).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(arr => {
        this.category_info = arr.map(item => {
          return {
            id: item.payload.doc.id,
            c_name: item.payload.doc.data()['c_name'],
          } as Categories;
        });
      });
    });
    this.snippetForm = new FormGroup({
      snippet: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required])
    });
  }

  newSnippet() {
    if(this.snippetForm.valid && this.categoryControl.valid) {
      const s_data = {
        "category": this.categoryControl.value,
        "snippet": this.snippetForm.value.snippet,
        "title": this.snippetForm.value.title,
        "date": new Date().toLocaleDateString()
      };
      this._fireStore.collection('snippets' + this.email).add(s_data).then(() => {
        this.toast.success("Snippet Added", {
          theme: 'snackbar',
          id: 'snippet',
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
    } else {
      this.toast.error("Invalid value entered", {
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
