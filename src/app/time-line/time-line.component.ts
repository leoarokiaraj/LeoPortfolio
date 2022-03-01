import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { debounce } from './debounce';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css', './time-line.component.responsive.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class TimeLineComponent implements OnInit {

  MaxAtricleCount: any = 6;
  MinArticleCount: any = 0;
  ArticleCount: any = 6;
  ScrollCount: any = 0;
  MaxScrollCount: any = 11;
  mobile: boolean = false;
  defaultTouch: any = { x: 0, y: 0, time: 0 };
  delayTimer:any;
  IsScrollDisabled:Boolean = true;
  envelope:any = {date:'', month:'', year:''};
  isScrolled:boolean = true;

  constructor(private router: Router, private changeDetect: ChangeDetectorRef, public datepipe: DatePipe) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.IsScrollDisabled = false;
    }, 1000);
    let today = Date.now()
    this.envelope.date = this.datepipe.transform(today, 'dd')
    this.envelope.month = this.datepipe.transform(today, 'MMM')
    this.envelope.year = this.datepipe.transform(today, 'yyyy')
  }

  ngAfterViewInit(): void {
    this.ResizeEvent(window.innerWidth, window.innerHeight);
  }


  @HostListener('mousewheel', ['$event']) 
  @debounce(250)
  onMousewheel(event) {
    if (!this.mobile && !this.IsScrollDisabled) {

      //Scroll UP
      if (event.wheelDelta > 0) {
        if (this.ScrollCount <= (this.MaxScrollCount - 5)) {
          if (this.ArticleCount < this.MaxAtricleCount) { this.ArticleCount++; }
          else {
            this.router.navigate(['aboutme']);
          }
        }
        this.ScrollCount--;

      }
      //Scroll Down
      if (event.wheelDelta < 0) {
        if (this.ArticleCount > this.MinArticleCount) { this.ArticleCount--; }
        if (this.ScrollCount < this.MaxScrollCount) { this.ScrollCount++; }
      }
      this.ScrollSwipeEvent();
    }
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
    if (this.mobile) {
      let articleDom = document.querySelector<HTMLElement>('#articles');
      if (Math.round(articleDom.scrollTop) >= Math.round(articleDom.scrollHeight - articleDom.offsetHeight)) {
        this.router.navigate(['contact']);
      }
    }
    else if (!this.mobile) {
      if (this.ScrollCount <= (this.MaxScrollCount - 5)) {
        if (this.ArticleCount < this.MaxAtricleCount) { this.ArticleCount++; }
        else {
          this.router.navigate(['aboutme']);
        }
      }
      this.ScrollCount--;
      this.ScrollSwipeEvent();
    }
  }

  doSwipeDown(event: any) {
    if (this.mobile && document.querySelector('#articles').scrollTop === 0) {
      this.router.navigate(['aboutme']);
    }
    else if (!this.mobile) {
      if (this.ArticleCount > this.MinArticleCount) { this.ArticleCount--; }
      if (this.ScrollCount < this.MaxScrollCount) { this.ScrollCount++; }
      this.ScrollSwipeEvent();
    }

  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.ResizeEvent(event.target.innerWidth, event.target.innerHeight);
  }

  @HostListener('window:orientationchange', ['$event']) onOrientationChange(event) {
    location.reload();
}

ScrollSwipeEvent() {

  let articleDOM = document.querySelector("#articles").children[0];

  if(this.ScrollCount >= 6)
  {
    let timer = 0;
    if(timer == 0) {
      for (let index = 1; index <= 6; index++) {

        let timer = window.setTimeout(()=>{
      
          if (this.ScrollCount == 6) {
            articleDOM.children[0].querySelector('#topID').classList.remove('openEnvelope');
            articleDOM.children[0].querySelector<HTMLInputElement>('#topID').style.zIndex = '20';
          }
          else if (this.ScrollCount == 7) {
            articleDOM.children[0].querySelector('#topID').classList.add('openEnvelope');
            articleDOM.children[0].querySelector('#topID').classList.remove('openEnvelopeImportant');
            articleDOM.children[0].querySelector<HTMLInputElement>('#paperID').style.top = "0px";
          }
          else if (this.ScrollCount == 8) {
            articleDOM.children[0].querySelector('#topID').classList.add('openEnvelopeImportant');
            articleDOM.children[0].querySelector<HTMLInputElement>('#paperID').style.top = "-60px";
            articleDOM.children[0].querySelector<HTMLInputElement>('#topID').style.zIndex = '0';
          }
          else if (this.ScrollCount == 9) {
            articleDOM.children[0].querySelector<HTMLInputElement>('#paperID').style.top = "-266px";
            articleDOM.children[0].querySelector<HTMLInputElement>('#paperID').style.transform = "scale(1)";
            articleDOM.children[0].querySelector('.envelope .bottom').removeAttribute('style')
            articleDOM.children[0].querySelector('.envelope .left').removeAttribute('style')
            articleDOM.children[0].querySelector('.envelope .right').removeAttribute('style')
          }
          else if (this.ScrollCount == 10) {
            articleDOM.children[0].querySelector<HTMLInputElement>('#paperID').style.transform = "scale(3)";
            articleDOM.children[0].querySelector<HTMLInputElement>('#paperID').style.top = "-60px";
        
            articleDOM.children[0].querySelector<HTMLInputElement>('.envelope .bottom').style.zIndex = '0';
            articleDOM.children[0].querySelector<HTMLInputElement>('.envelope .left').style.zIndex = '0';
            articleDOM.children[0].querySelector<HTMLInputElement>('.envelope .right').style.zIndex = '0';
          }
          else if (this.ScrollCount == 11) {
            articleDOM.children[0].querySelector<HTMLInputElement>('#paperID').style.transform = "scale(6)";
            this.router.navigate(['contact']);
          }
    
          for (var i = this.MaxAtricleCount; i >= 0; i--) {
            var modifiedClassName = 'activeAfter' + (this.ArticleCount - i);
            if (i == this.ArticleCount) {
              articleDOM.children[i].className = articleDOM.children[i].className.replace(/(^|\W)active(\w+)/g, ' activeSection');
            }
            else if (i > this.ArticleCount) {
              articleDOM.children[i].className = articleDOM.children[i].className.replace(/(^|\W)active(\w+)/g, ' activeBefore1');
            }
            else if (i < this.ArticleCount) {
              articleDOM.children[i].className = articleDOM.children[i].className.replace(/(^|\W)active(\w+)/g, ' ' + modifiedClassName);
            }
          }
  
          this.ScrollCount++;
    
        },500 * index)
        
      }
    }
    
  }

  for (var i = this.MaxAtricleCount; i >= 0; i--) {
    var modifiedClassName = 'activeAfter' + (this.ArticleCount - i);
    if (i == this.ArticleCount) {
      articleDOM.children[i].className = articleDOM.children[i].className.replace(/(^|\W)active(\w+)/g, ' activeSection');
    }
    else if (i > this.ArticleCount) {
      articleDOM.children[i].className = articleDOM.children[i].className.replace(/(^|\W)active(\w+)/g, ' activeBefore1');
    }
    else if (i < this.ArticleCount) {
      articleDOM.children[i].className = articleDOM.children[i].className.replace(/(^|\W)active(\w+)/g, ' ' + modifiedClassName);
    }
  }
}

  ResizeEvent(width: any, height: any) {
    if (width <= 425) {
      this.mobile = true;
    }
    else {
      this.mobile = false;
    }
    this.changeDetect.detectChanges();

    if (!this.mobile) {
      document.querySelector<HTMLElement>('#TimeLineID').style.height = height + 'px';
      let activeWidth = document.querySelector('.activeSection').clientWidth;
      let birthContentWidth = document.querySelector('.birthContent').clientWidth;
      let envelopeContentWidth = document.querySelector('.envelopeContent').clientWidth;
      let birthPaddingLeft = ((activeWidth - birthContentWidth) / 2);
      document.querySelector<HTMLElement>('#BirthAlign').style.paddingLeft = birthPaddingLeft + 'px';
      let envelopePaddingLeft = ((activeWidth - envelopeContentWidth) / 2);
      document.querySelector<HTMLElement>('#EnvelopeAlign').style.paddingLeft = envelopePaddingLeft + 'px';
    }
  }

}
