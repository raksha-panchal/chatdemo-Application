import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isNull } from 'util';

import swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [UserService]
})

export class ChatComponent implements OnInit {

  content: any;
 type = true;
 isTyping=false;
 status:any
  msg: any
  messagelist: Array<any>;
  messageArray: Array<any> = [];
  imageup:Array<any>=[];
  imageArray:Array<any>=[];
  messageArray2: Array<{ name: String, message: String }> = [];
  messageArray1: String
  constructor(private UserService: UserService,
    private router: Router) {
    

    this.UserService.send().subscribe((data:any) => {
   })
   
    this.UserService.send2().subscribe((data:any) => {
     if (localStorage.getItem('roomdata') == data.roomId && data.status=="Active") {
        for(let i=0;i<this.messageArray.length;i++){
          this.messageArray[i].status='seen'
         }
        } else {
         return
       }
      })


    this.UserService.send1().subscribe((data:any) => {
     if (localStorage.getItem('roomdata') == data.roomId) {
       if(data.receiverId[0].status=='Active'){
          this.messageArray.push(data)
             for(let i=0;i<this.messageArray.length;i++){
            this.messageArray[i].status='seen'
           }
        }else{
          this.messageArray.push(data)
        }
       } 
     })


    this.UserService.typeOn().subscribe(data => {
      var id = localStorage.getItem('_id')
      if (localStorage.getItem('roomdata') == data.roomId && data.data.indexOf(id) > -1) {
      this.messageArray1 = data.name
        this.msg = ".........typing"
        this.type = false;
      } else {
        this.type=true ;
        return;
      }
    })
   
    this.UserService.typeOn1().subscribe(data => {
      this.messageArray1 =null
      this.msg = null
      this.type = false;
   })
  }

  
  ngOnInit() {
    this.getmsg()
  
  }

  hide(e: any) {
    console.log("hoiide")
    }
  

  typing() {
    var id = localStorage.getItem('_id')
    var roomid = localStorage.getItem('roomdata')
    this.UserService.typing({ id, roomid })
 }

  getmsg() {
    this.UserService.getmsg().subscribe((data: any) => {
      this.messagelist = data.result
    })
  }

  sendmessage() {
    this.type = true;
    var id = localStorage.getItem('_id')
    var roomid = localStorage.getItem('roomdata')
    this.UserService.sendmessage({ content: this.content, senderId: id, roomId: roomid })
    this.content = null;
 }

 async  imageuploading(event){
    let files = event.target.files;
    let allFiles = []
    if (files.length <= 5) {
      var counter = 0;
      for (let i in files) {
        if (counter < files.length) {
          allFiles.push(files[i]);
          counter++;
        }
      }
      let obj;
      obj = await this.uploadImage(allFiles);
   }else{
    swal({
      type:'error',
      position: 'center',
      title: 'please select only Five Image',
      showConfirmButton: false,
      timer: 1500
    })
   }

}

uploadImage(images){
   var id = localStorage.getItem('_id')
    var roomid = localStorage.getItem('roomdata')
   this.UserService.uploadImage(images).subscribe((data:any)=>{
     console.log("llllllllllllll",data.URL.length)
    for(let i=0;i<data.URL.length;i++){
      this.UserService.sendmessage({content:data.URL[i], senderId: id, roomId: roomid ,contentType:'file'})
    }
 })
  }

  public onScrollEvent(event: any): void {
    console.log(event);
  }
}
