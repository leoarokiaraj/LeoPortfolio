import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import * as globalVariables from '../global';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css', './about-me.component.responsive.css'],
  encapsulation: ViewEncapsulation.None
})
export class AboutMeComponent implements OnInit {

  AboutAssetPath: String = globalVariables.AssetPath + globalVariables.AboutAsset;
  aboutMeDOM: any = '';
  mobile: boolean = true;
  defaultTouch: any = { x: 0, y: 0, time: 0 };
  textUpdateCounter: any = 0;
  setIntr: any;
  IsScrollDisabled:Boolean = true;
  joinDate:any = new Date(2016,5,9,0,0,0,0)
  expYrs:number = 4;

  constructor(private router: Router) { 
    this.expYrs =  Math.abs(new Date(this.joinDate - Date.now()).getUTCFullYear() - 1970);
  }

  ngOnInit(): void {
    this.ResizeEvent(document.querySelector('#AboutMeBackground').clientWidth, document.querySelector('#AboutMeBackground').clientHeight);
    setTimeout(() => {
      this.IsScrollDisabled = false;
    }, 1000);
  }
  ngAfterViewInit(): void {
    this.aboutMeDOM = document.querySelector('#aboutMe');
    this.aboutMeDOM.style.height = window.innerHeight + 'px';
    setTimeout(() => {
      this.TextUpdate();
    }, 1000);

  }
  ngOnDestroy() {
    clearInterval(this.setIntr);
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if(!this.IsScrollDisabled){
    if (event.wheelDelta > 0) {
      this.router.navigate(['']);
    }
    if (event.wheelDelta < 0) {
      this.router.navigate(['timeline']);
    }
  }
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.ResizeEvent(event.target.innerWidth, event.target.innerHeight);
  }

  @HostListener('window:orientationchange', ['$event']) onOrientationChange(event) {
    location.reload();
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
    let articleDom = document.querySelector<HTMLElement>('#aboutMe');
    if (Math.round(articleDom.scrollTop) >= (Math.round(articleDom.scrollHeight - articleDom.offsetHeight))) {
      this.router.navigate(['timeline']);
    }
  }

  doSwipeDown(event: any) {
    if (document.querySelector('#aboutMe').scrollTop === 0) {
      this.router.navigate(['']);
    }
  }


  ResizeEvent(width: any, height: any) {
    if (width <= 900) {
      this.mobile = true;
    }
    else {
      this.mobile = false;
    }
  }

  TextUpdate() {
    this.setIntr = setInterval(() => {
      try {
        switch (this.textUpdateCounter) {
          case 0:
            document.querySelector('.all').classList.add('strike');
            document.querySelector<HTMLSpanElement>('.some').style.display = 'inline';
            break;
          case 1:
            document.querySelector('.some').classList.add('strike');
            document.querySelector<HTMLSpanElement>('.one').style.display = 'inline';
            break;
          case 2:
            document.querySelector('.one').classList.add('strike');
            document.querySelector<HTMLSpanElement>('.ofyour').style.display = 'none';
            document.querySelector<HTMLSpanElement>('.your').style.display = 'inline';
            document.querySelector<HTMLSpanElement>('.ok').style.display = 'inline';
            break;
        }
        this.textUpdateCounter++;
        if (this.textUpdateCounter > 2)
          clearInterval(this.setIntr);
      }
      catch (err) {
        clearInterval(this.setIntr);
        console.log('err ' + err);
      }
    }, 3000);

  }

}
