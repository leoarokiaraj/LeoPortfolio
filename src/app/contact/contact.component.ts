import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from '../Service/firebase.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', './contact_download.component.css', './contact.component.responsive.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ContactComponent implements OnInit {

  defaultTouch: any = { x: 0, y: 0, time: 0 };
  fbStorageRef: any;

  constructor(private router: Router, private firebase: AngularFireStorage, private firebaseService: FirebaseService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.fbStorageRef = this.firebase.storage.ref();
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    // if (event.wheelDelta > 0) {
    //   let articleDom = document.querySelector<HTMLElement>('.ContactContent');
    // if (articleDom.scrollTop === 0) {
    //   this.router.navigate(['timeline']);
    // }
    // }
  }

  DownloadResume() {
    console.log(environment.DownloadFileName)
    this.fbStorageRef.child(environment.DownloadFileName).getDownloadURL().then(function(url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
        const blobURL= window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobURL;
        a.download = environment.DownloadFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      xhr.open('GET', url);
      xhr.send();
}).catch(function(error) {

  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object-not-found':
      // File doesn't exist
      break;

    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    case 'storage/unknown':
      // Unknown error occurred, inspect the server response
      break;
  }
});;



    var btn = document.querySelector("#downloadButton");
    var label = btn.querySelector('.label');
    var counter = label.querySelector('.counter');

    if (!btn.classList.contains('active') && !btn.classList.contains('done')) {

      btn.classList.add('active');

      this.setLabel(label, label.querySelector('.default'), label.querySelector('.state'), () => { });

      setTimeout(() => {
        counter.classList.add('hide');
        btn.classList.remove('active');
        btn.classList.add('done');
      }, 4000);

      setTimeout(() => {
        this.setLabel(label, label.querySelector('.state'), label.querySelector('.default'), () => {
          counter.classList.remove('hide');
          btn.classList.remove('done');
        })
      }, 8000);

    }

  }

SendPing(){
  if(this.ValidatePing(document.querySelector<HTMLElement>("#name")) && this.ValidatePing(document.querySelector<HTMLElement>("#email")))
  {
    let name = document.querySelector<HTMLInputElement>("#name").value;
    let email_id = document.querySelector<HTMLInputElement>("#email").value;
    let content = document.querySelector<HTMLInputElement>("#discuss").value;
    var data = {content : content, email_id : email_id, name: name, docID: this.datepipe.transform(Date.now(), 'dd_MM_yyyy_HH_mm_ss_SSS')};
    this.firebaseService.addContact(data)
             .then(() => {
                      this.ClearPingContent();
                      this.showSnackBar();
                  })
             .catch((err)=>{ console.log( err )});
  }
}

ValidatePing(event){
  if(typeof event.value != 'undefined' && event.value) {
    if(event.id === 'email') {
      var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if(regexp.test(event.value))
      {
        document.querySelector<HTMLElement>("#"+event.id).classList.replace('ContactValidationFail', 'ContactValidationDefault');
        return true;
      }
      else
      {
        document.querySelector<HTMLElement>("#"+event.id).classList.replace('ContactValidationDefault', 'ContactValidationFail');
        return false;
      }
    }
    else {
      document.querySelector<HTMLElement>("#"+event.id).classList.replace('ContactValidationFail', 'ContactValidationDefault');
      return true;
    }
  }
  else {
    document.querySelector<HTMLElement>("#"+event.id).classList.replace('ContactValidationDefault', 'ContactValidationFail');
      return false;
  }
}

ClearPingContent(){
  document.querySelector<HTMLInputElement>("#name").value = "";
  document.querySelector<HTMLInputElement>("#email").value = "";
  document.querySelector<HTMLInputElement>("#discuss").value = "";
}

  @HostListener('touchstart', ['$event'])
  //@HostListener('touchmove', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event: any) {
    let touch = event.touches[0] || event.changedTouches[0];

    // check the events
    if (event.type === 'touchstart') {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = event.timeStamp;
    } else if (event.type === 'touchend') {
      let deltaX = touch.pageX - this.defaultTouch.x;
      let deltaY = touch.pageY - this.defaultTouch.y;
      let deltaTime = event.timeStamp - this.defaultTouch.time;

      // simulte a swipe -> less than 500 ms and more than 60 px
      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 60) {
          // delta x is at least 60 pixels
          if (deltaX > 0) {
            this.doSwipeRight(event);
          } else {
            this.doSwipeLeft(event);
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            this.doSwipeDown(event);
          } else {
            this.doSwipeUp();
          }
        }
      }
    }
  }

  doSwipeLeft(event: any) {
  }

  doSwipeRight(event: any) {
  }

  doSwipeUp() {

  }

  doSwipeDown(event: any) {
    // let articleDom = document.querySelector<HTMLElement>('.ContactContent');
    // if (articleDom.scrollTop === 0) {
    //   this.router.navigate(['timeline']);
    // }

  }



  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMove(event: any) {
    this.update(event);
  }

  update(e: any) {
    let x = e.clientX;
    let y = e.clientY;
    if (e.type == 'touchmove') {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }

    document.querySelector<HTMLElement>('#ContactRoot').style.setProperty('--cursorX', x + 'px')
    document.querySelector<HTMLElement>('#ContactRoot').style.setProperty('--cursorY', y + 'px')
  }

  setLabel(div: any, oldD: any, newD: any, callback: any) {
    oldD.classList.add('hide');
    oldD.classList.remove('show');
    oldD.classList.remove('hide');
    newD.classList.add('show');
    div.removeAttribute('style');
    if (typeof callback === 'function') {
      callback();
    }
  }

  showSnackBar() {
  var x = document.querySelector<HTMLElement>("#snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
}
