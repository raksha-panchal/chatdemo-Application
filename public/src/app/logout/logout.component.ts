import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
    private UserService: UserService) { }

  ngOnInit() {
  }

  logout() {
    console.log("in logout")
    this.UserService.logOut().subscribe((response: any) => {
      this.router.navigate([''])
      localStorage.removeItem('_id')
      localStorage.removeItem('roomdata')
    },(err)=>{
      console.log(err)
    })

  }
}
