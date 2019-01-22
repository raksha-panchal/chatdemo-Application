import { UserService } from './../user.service';
import { Routes, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginform: FormGroup;
  constructor(private router: Router,
    private formbuilder: FormBuilder,
    private UserService: UserService) { }

  ngOnInit() {
    this.loginform = this.formbuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })

  }
  get f() {
    return this.loginform.controls
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginform.invalid) {
      return false
    }
    this.UserService.login(this.loginform.value).subscribe((data:any) => {
      if (data['code'] == 200) {
        localStorage.setItem('_id',data.result._id)
        swal({
          position: 'center',
          type: 'success',
          title: data['message'],
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/dashboard']);
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
