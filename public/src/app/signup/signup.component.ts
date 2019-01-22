import { UserService } from './../user.service';
import { Routes, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import swal from 'sweetalert2'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  submitted = false;
  form1: FormGroup;
  constructor(private router: Router,
    private formbuilder: FormBuilder,
    private UserService: UserService) { }

  ngOnInit() {
    this.form1 = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNo: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  get f() {
    return this.form1.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.form1.invalid) {
      return false
    }
    this.UserService.register(this.form1.value).subscribe((data) => {
      if (data['code'] == 200) {
        swal({
          position: 'center',
          type: 'success',
          title: data['message'],
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['']);
      } else {
        swal({
          type: 'error',
          text: data['message']
        })
      }
    }, (err) => {
      console.log(err)
    })
  }

}
