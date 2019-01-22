import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usersList: Array<any>;
  groupNameList: Array<any>;

  public result: any;
  constructor(private router: Router,
    private UserService: UserService) {

    this.UserService.getAllMsg().subscribe(data => {
      localStorage.setItem('roomdata', data._id)
      this.router.navigate(['/chat'])
    })
  }

  ngOnInit() {
    this.getuser()
    this.getGroup()
  }
  groupRoom(id) {
    localStorage.setItem('roomdata', id)
    this.router.navigate(['chat'])
  }
  getGroup() {
    this.UserService.getGroup().subscribe((response: any) => {
      this.groupNameList = response.result
    })
  }
  getuser() {
    this.UserService.getuser().subscribe((response: any) => {
      this.usersList = response.result
    })
  }

  room(rid: any) {
    var id = localStorage.getItem('_id')
    this.UserService.room({ id, rid })

  }
}
