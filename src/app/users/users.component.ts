import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AddUpdateUsersComponent } from './add-update-users/add-update-users.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    "username",
    "email",
    "role",
    "Action",
  ];
  dataSource = new MatTableDataSource<Element>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  usersArray: any[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserdata();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUserdata() {
    const storedUsers = localStorage.getItem('userData');
    if (storedUsers) {
      this.usersArray = JSON.parse(storedUsers);
    } else {
      this.usersArray = [];
    }
    this.dataSource = new MatTableDataSource<any>(this.usersArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(Data: any): void {
    const dialogRef = this.dialog.open(AddUpdateUsersComponent, {
      disableClose: true,
      width: '400px',
      data: Data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUserdata();
    });
  }



  openDeleteDialog(Data: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.usersArray.findIndex(user =>
          user.email === Data.email && user.username === Data.username
        );

        if (index !== -1) {
          this.usersArray.splice(index, 1);
          localStorage.setItem('userData', JSON.stringify(this.usersArray));
          this.getUserdata();
          Swal.fire(
            'Deleted!',
            'The user has been removed.',
            'success'
          );
        }
      }
    });
  }


}

