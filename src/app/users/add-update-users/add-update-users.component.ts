import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-update-users',
  templateUrl: './add-update-users.component.html',
  styleUrls: ['./add-update-users.component.scss']
})
export class AddUpdateUsersComponent implements OnInit {
  Roles: any[] = [
    {
      Id: 1, Role: "Admin"
    },
    {
      Id: 2, Role: "User"
    }

  ]
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  form: FormGroup = new FormGroup({

    username: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl(''),

  });
  submitted = false;
  usersArray: any[] = [];
  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<AddUpdateUsersComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: [this.data === 'Add' ? '' : this.data?.username],
        email: this.data === 'Add' ? ['', [Validators.required, Validators.email]] : [this.data?.email, [Validators.required, Validators.email]],
        role: [this.data === 'Add' ? '' : this.data?.role],
      },

    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    const storedUsers = localStorage.getItem('userData');
    if (storedUsers) {
      this.usersArray = JSON.parse(storedUsers);
    } else {
      this.usersArray = [];
    }
    this.submitted = true;
    this.f['email'].markAsTouched();
    if (this.f['email'].invalid) {
      return;
    }
    else {
      if (this.data === 'Add') {
        const userData = {
          username: this.form.value.username,
          email: this.form.value.email,
          role: this.form.value.role
        };

        this.usersArray.push(userData);
        localStorage.setItem('userData', JSON.stringify(this.usersArray));
        this.successmsg("User added successfully.");
        this.dialogRef.close();

      } else {
        const index = this.usersArray.findIndex(users =>
          users.username === this.data.username && users.email === this.data.email
        );

        if (index !== -1) {
          this.usersArray[index] = {
            email: this.form.value.email,
            username: this.form.value.username,
            role: this.form.value.role
          };
          localStorage.setItem('userData', JSON.stringify(this.usersArray));
          this.successmsg("User updated successfully.");
          this.dialogRef.close();
        } else {
          this.errormsg("User not Added.");
        }
      }
    }
  }

  successmsg(msg: string): void {
    const duration = 2000;
    const matSnackbarConfig: MatSnackBarConfig = {
      panelClass: ["snackbar-success"],
      duration: duration,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    };
    this._snackBar.open(msg, "Dismiss", matSnackbarConfig);
  }

  errormsg(msg: string): void {
    const duration = 2000;
    const matSnackbarConfig: MatSnackBarConfig = {
      panelClass: ["snackbar-error"],
      duration: duration,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    };
    this._snackBar.open(msg, "Dismiss", matSnackbarConfig);
  }
}
