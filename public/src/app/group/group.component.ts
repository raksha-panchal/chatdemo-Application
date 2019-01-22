import { Router } from '@angular/router';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
// import { resolveReflectiveProviders } from '@angular/core/src/di/reflective_provider';
import swal from 'sweetalert2'

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  userlist: Array<any> = [];
  userid: Array<any> = [];
  userexist: Array<any> = [];
  groupName: String

  constructor(private UserService: UserService,
    private router: Router) {
    this.UserService.groupNotify().subscribe(data => {
     localStorage.setItem('roomdata', data._id)
      this.router.navigate(['/chat'])
    })
   }

  ngOnInit() {
    this.getuser()

  }
  getuser() {
    this.UserService.getuser().subscribe((data: any) => {
      this.userlist = data.result

    })
  }
  join(id, name) {
    if (this.userexist.indexOf(name) == -1) {
      this.userexist.push(name)
    }
    if (this.userid.indexOf(id) == -1) {
      this.userid.push(id)
    }

  }
  submit() {
    if (this.userexist.length == 0) {
      swal({
        position: 'center',
        title: 'please select one contact',
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      var id = localStorage.getItem('_id')
      this.userid.push(id)
    this.UserService.group1({ groupName: this.groupName, participants: this.userid, chattype: 'group' })
      this.router.navigate(['chat'])
    }
  }
}



