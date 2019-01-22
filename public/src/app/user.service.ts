import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

import { map, catchError } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private socket = io('http://localhost:7000/');

  login(user: any) {
    return this.http.post('http://localhost:7000/login', user, httpOptions)
  }

  logOut() {
    var id = localStorage.getItem('_id');
    return this.http.post('http://localhost:7000/logout/' + id, httpOptions)
  }

  register(user: any) {
    return this.http.post('http://localhost:7000/signup', user, httpOptions)
  }

  getuser() {
    var id = localStorage.getItem('_id');
    return this.http.get('http://localhost:7000/getuser/' + id, httpOptions)
  }

  getGroup() {
    var id = localStorage.getItem('_id')
    return this.http.get('http://localhost:7000/getGroup/' + id, httpOptions)
  }

  getmsg() {
    var id = localStorage.getItem('roomdata')
    return this.http.get('http://localhost:7000/getmessage/' + id, httpOptions).
      pipe(
        map((res: Response) => {
          return res
        }),
      );
  }

  uploadImage(pic:any){
    console.log("in image",pic)
    let formData = new FormData();
    pic.map((res) => {
          formData.append('img', res);
   })
    return this.http.post('http://localhost:7000/imageupload1',formData)
  }

  // uploadImage(pic:any){
  //   var id = localStorage.getItem('_id')
  //   var roomid = localStorage.getItem('roomdata')
  //   var formData = new FormData();
  //      pic.map((res) => {
  //           formData.append('img', res);
  //    })
  //   let data={
  //      formData,senderId: id, roomId: roomid,contentType:'file'
  //    }
  //    console.log("in data",data)
  //    this.socket.emit('uploadedimage',data)

  // }
  room(data) {
    this.socket.emit('join', data);
    this.socket.on('room', (data) => {
      localStorage.setItem('roomdata', data._id)
    })
  }


  getAllMsg() {
    let observable = new Observable<any>(data => {
      this.socket.on('roomData', (result) => {
        data.next(result)
      });
      return () => { this.socket.disconnect() }
    });
    return observable;
  }

  // getm(){
  //   var rid = localStorage.getItem('roomdata')
  //   var  id=localStorage.getItem('_id')
  //   let user={
  //     rid,id
  //   }
  //   this.socket.emit("msg",user)
  //   let observable=new Observable<any>(data=>{
  //     this.socket.on('msg1',(result)=>{
  //       console.log("in................................................",result)
  //       data.next(result)
  //     })
  //     return () => { this.socket.disconnect() }
  //   })
  //   return observable;
  // }

  sendmessage(data) {
    console.log("mmmmmm",data)
    this.socket.emit('send', data)
  }
  // uploadImage(data){

  // }
  typing(data) {
    this.socket.emit('typing', data)
  }

  typeOn() {
    let obseravable = new Observable<any>(data => {
      this.socket.on('in typing', (result) => {
        data.next(result)
      })
      return () => { this.socket.disconnect() }
    });
    return obseravable;
  }

  typeOn1() {
    let obseravable = new Observable<any>(data => {
      this.socket.on('click', (result) => {
        data.next(result)
      })
      return () => { this.socket.disconnect() }
    });
    return obseravable;
  }


  send() {
    let observable = new Observable<{ name: String, message: String, roomId: String }>(data => {
      this.socket.on('message', (result) => {
        this.socket.emit('messageto',(result))
      data.next(result)
      });
      return () => { this.socket.disconnect() }
    });
    return observable;
  }
   
  send1(){
    let obseravable = new Observable<any>(data => {
      this.socket.on('get', (result) => {
        data.next(result)
      })
      return () => { this.socket.disconnect() }
    });
    return obseravable;
  }

  
  send2(){
    let obseravable = new Observable<any>(data => {
      this.socket.on('msg1', (result) => {
        console.log("in result",result)
        data.next(result)
      })
      return () => { this.socket.disconnect() }
    });
    return obseravable;
  }

  group1(data: any) {
    this.socket.emit('Cgroup', data)
 }

  groupNotify() {
    let observable = new Observable<any>(data => {
      this.socket.on('grouproom', (result) => {
        data.next(result)
      })
      return () => { this.socket.disconnect() }
    });
    return observable;
  }

 
}
