import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import * as globalVariables from '../global';
import * as anime from '../../assets/anime.min.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './home.component.responsive.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  HomeAssetPath: String = globalVariables.AssetPath + globalVariables.HomeAsset;
  helloTextWrapper: any = document.querySelector('#HelloText');
  welcomeTextWrapper: any = document.querySelector('#WelcomeText');
  welcomeTextMobileWrapper1: any = document.querySelector('#WelcomeTextMobile1');
  welcomeTextMobileWrapper2: any = document.querySelector('#WelcomeTextMobile2');
  webPageContentElement: any = document.querySelector("#WebPageContent");
  tabElement: any = document.querySelector("#tabID");
  lastScrollVal: any = 0;
  maxScrollLimit: any = 0;
  MaxScrollCount: any = 7;
  MinScrollCount: any = 1;
  ScrollCount: any = 1;
  mobile: boolean = true;
  defaultTouch: any = { x: 0, y: 0, time: 0 };

  constructor(private router: Router, private changeDetect: ChangeDetectorRef) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.ResizeEvent(document.querySelector('.HomeBackground').clientWidth, document.querySelector('.HomeBackground').clientHeight);
    this.helloTextWrapper = document.querySelector('#HelloText');
    this.webPageContentElement = document.querySelector("#WebPageContent");
    this.tabElement = document.querySelector("#tabID");
    this.helloTextWrapper.innerHTML = this.helloTextWrapper.textContent.replace(/\S/g, "<span class='helloLetters'>$&</span>");

    this.welcomeTextWrapper = document.querySelector('#WelcomeText');
    this.welcomeTextWrapper.innerHTML = this.welcomeTextWrapper.textContent.replace(/\S/g, "<span class='welcomeLetters'>$&</span>");

    anime.timeline()
      .add({
        targets: '#HelloText .helloLetters',
        scale: [4, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70 * i
      });
    anime.timeline()
      .add({
        targets: '#WelcomeText, .welcomeLetters',
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: anime.stagger(100, {
          start: 6000
        })
      });
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMove(event: any) {
    this.update(event);
  }

  @HostListener('window:orientationchange', ['$event']) onOrientationChange(event) {
    location.reload();
  }

  update(e: any) {
    let x = e.clientX;
    let y = e.clientY;
    if (e.type == 'touchmove') {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    document.querySelector<HTMLElement>('#HomeRoot').style.setProperty('--cursorX', x + 'px')
    document.querySelector<HTMLElement>('#HomeRoot').style.setProperty('--cursorY', y + 'px')
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event: any) {
    if ((event.wheelDelta > 0) && (this.ScrollCount > this.MinScrollCount)) {
      this.ScrollCount--;
    }
    if ((event.wheelDelta < 0) && (this.ScrollCount < this.MaxScrollCount)) {
      this.ScrollCount++;
    }
    this.tabElement.style.transform = "scale(" + this.ScrollCount + ")";
    if (this.ScrollCount == 7) {
      this.router.navigate(['aboutme']);
    }
    if(this.ScrollCount == 1)
    {
      document.querySelector<HTMLElement>('#scrollMore').style.setProperty('display','block')
    }
    else if(this.ScrollCount > 1)
    {
      document.querySelector<HTMLElement>('#scrollMore').style.setProperty('display','none')
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.ResizeEvent(event.target.innerWidth, event.target.innerHeight);
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
    document.querySelector<HTMLElement>('#scrollMore').style.setProperty('display','none');
    for (let i = 1; i <= 7; i++) {
      this.DelayScroll(i);
    }
  }

  doSwipeDown(event: any) {
  }

  DelayScroll(i: any) {
    setTimeout(() => {
      if (i < 2) {
        document.querySelector<HTMLElement>('.tabContainer').style.setProperty('--tabBottom', '0px');
      }
      else if (i == 7)
        this.router.navigate(['aboutme']);
      else {
        this.tabElement.style.transform = "scale(" + i + ")";
      }
    }, 100 * i);
  }


  ResizeEvent(width: any, height: any) {
    if (document.querySelector('.HomeBackground').clientWidth <= 425) {
      this.mobile = true;
    }
    else {
      this.mobile = false;
    }
    this.changeDetect.detectChanges();
    document.querySelector<HTMLElement>('.tabContainer').style.setProperty('--tabBottom', '-' + (document.querySelector('.tabContainer').clientHeight / 2) + 'px')
    /*if (width <= 1024 && width >= 768) {
      this.mobile = false;
      document.querySelector('#Layer_1').setAttribute('viewBox', '0 50 750 750');
    }

    else if (width <= 767 && width >= 426) {
      this.mobile = false;
      document.querySelector('#Layer_1').setAttribute('viewBox', '0 50 850 850');
    }

    else if (width <= 425) {
      this.mobile = true;
      document.querySelector('#Layer_1').setAttribute('viewBox','50 50 550 550');
    }

    else if (width > 1024) {
      this.mobile = false;
      document.querySelector('#Layer_1').setAttribute('viewBox', '0 50 650 650');
    }*/
  }


}
