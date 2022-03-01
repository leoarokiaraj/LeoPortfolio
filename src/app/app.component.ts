import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LeoPortfolio';
  @ViewChild('navElem', { read: ElementRef }) private NavElem: ElementRef;
  @ViewChild('navElem') public NavComp: any;

  constructor(private renderer: Renderer2) {
    /**
     * This events get called by all clicks on the page
     */
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.NavElem.nativeElement.contains(e.target)) {
        this.NavComp.expand(true);
      }
    });
    this.renderer.listen('window', 'mousewheel', (e: Event) => {
      if (this.NavComp.menuOpen) {
        this.NavComp.expand(true);
      }
    });
    this.renderer.listen('window', 'touchmove', (e: Event) => {
      if (this.NavComp.menuOpen) {
        this.NavComp.expand(true);
      }
    });

  }


  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#loader');
    this.renderer.setStyle(loader, 'display', 'none');
  }
}
