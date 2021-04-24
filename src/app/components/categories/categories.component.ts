import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddCategoryComponent } from './add-category/add-category.component';
import { Categories } from './categories.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  private unsubscribe = new Subject();
  dataSource = new MatTableDataSource<Categories>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columnsToDisplay = [
    "categories", "date", "actions"
  ];
  user: string = '';
  constructor(
    private titleService: Title,
    private _fireStore: AngularFirestore,
    private _toast: HotToastService,
    private _dialog: MatDialog,
    private _auth: AngularFireAuth
  ) {
    this.titleService.setTitle("Categories");
    this._auth.authState.pipe(takeUntil(this.unsubscribe)).subscribe((user) => {
      this.user = user.email;
      this._fireStore.collection("categories" + user.email).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(arr => {
        this.dataSource.data = arr.map(item => {
          return {
            id: item.payload.doc.id,
            c_name: item.payload.doc.data()['c_name'],
            date: item.payload.doc.data()['date'],
          } as Categories;
        });
      });
    });
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(id: string): void {
    const p = confirm("Are you sure you want to delete?");
    if (p === true) {
      this._fireStore.collection("categories" + this.user).doc(id).delete().then(() => {
        this._toast.success("Category Deleted !", {
          theme: 'snackbar',
          position: 'bottom-center',
          id: 'delete'
        });
      });
    }
  }

  addCategoryWindow() {
    this._dialog.open(AddCategoryComponent, {
      width: "400px",
      autoFocus: true,
      disableClose: true
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}