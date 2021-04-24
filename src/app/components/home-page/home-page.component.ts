import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddSnippetComponent } from './add-snippet/add-snippet.component';
import { Snippet } from './snippet.model';
import { ViewMoreComponent } from './view-more/view-more.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  dataSource = new MatTableDataSource<Snippet>();
  private unsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columnsToDisplay = [
    "category","title","action"
  ];
  user: string = '';
  constructor(
    private titleService: Title,
    private _fireStore: AngularFirestore,
    private _toast: HotToastService,
    private _dialog: MatDialog,
    private _auth: AngularFireAuth
  ) { 
    this.titleService.setTitle("Snippets");
    this._auth.authState.pipe(takeUntil(this.unsubscribe)).subscribe((user)=>{
      this.user = user.email;
      this._fireStore.collection("snippets" + user.email).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(arr => {
        this.dataSource.data = arr.map(item => {
          return {
            id: item.payload.doc.id,
            category: item.payload.doc.data()['category'],
            title: item.payload.doc.data()['title'],
            snippet: item.payload.doc.data()['snippet'],
            date: item.payload.doc.data()['date'],
          } as Snippet;
        });
      });
    });
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {}

  onDelete(id: string): void {
    const p = confirm("Are you sure you want to delete?");
    if(p === true) {
      this._fireStore.collection("snippets" + this.user).doc(id).delete().then(()=>{
        this._toast.success("Snippet Deleted !", {
            theme: 'snackbar',
            position: 'bottom-center',
            id: 'delete'
        });
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addSnippetWindow() {
    this._dialog.open(AddSnippetComponent, {
      width: "400px",
      autoFocus: false,
      disableClose: true
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  viewMore(row) {
    this._dialog.open(ViewMoreComponent, {
      width: "400px",
      autoFocus: false,
      disableClose: true,
      data: row
    });
  }
}
