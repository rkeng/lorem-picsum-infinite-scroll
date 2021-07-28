// Foundations
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

// RxJS
import { filter, map, pairwise, throttleTime } from 'rxjs/operators';

// Models
import { Photo } from './models/photo.model';

// Services
import { PhotoService } from './services/photo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;
  pageNumber: number;
  photoList: Photo[];
  isMobile = false;

  constructor(
    private ngZone: NgZone,
    private photoService: PhotoService
  ) {
    this.pageNumber = 0;
    this.photoList = [];
  }

  // Life cycles

  ngOnInit() {
    this.isMobile = window.innerWidth <= 576;
    this.loadMore();
  }

  ngAfterViewInit() {
    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && (this.isMobile ? y2 < 272 : y2 < 368))),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.loadMore();
      });
    });
  }

  // Public methods

  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 576;
  }

  // Private methods

  private loadMore() {
    this.photoService.getPhotos(++this.pageNumber, 10)
      .subscribe(photos => {
        this.photoList = this.photoList.concat(photos);
      });
  }
}
