import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {

  menu: any;
  menuOpen: boolean = false;
  NavPages: any = ['home', 'aboutme', 'timeline', 'contact'];
  PagesList: any = ['home', 'aboutme', 'timeline', 'contact'];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.menu = document.querySelector<HTMLElement>('#menu').childNodes;
  }


  navigate(pageName:string){
    this.expand(true);
    this.router.navigate([pageName == 'home'? '' : pageName]);
  }

  expand(menuToggle:boolean) {
    if(this.router.url.replace('/','') === ""){
      this.NavPages = this.PagesList.filter(page => page !== "home");
    }
    else{
      this.NavPages = this.PagesList.filter(page => page !== this.router.url.replace('/',''));
    }

    const menuBtn = document.querySelector('.hamburger');
    if (!menuToggle) {
      menuBtn.classList.add('open');
      document.querySelector<HTMLElement>("#menu").style.transform = 'scale(1)';

      this.menu[0].style.transform = 'translate(12vmin,6.5vmin)';
      this.menu[1].style.transform = 'translateY(13vmin)';
      this.menu[2].style.transform = 'translate(-12vmin,6.5vmin)';
      this.menuOpen = true;
    } else {
      menuBtn.classList.remove('open');
      document.querySelector<HTMLElement>("#menu").style.transform = 'scale(0.9)';

      this.menu[0].style.transform = 'translate(0)';
      this.menu[1].style.transform = 'translateY(0)';
      this.menu[2].style.transform = 'translate(0)';
      this.menuOpen = false;
    }
  }
}
