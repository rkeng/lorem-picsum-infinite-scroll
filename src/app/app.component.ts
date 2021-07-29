// Foundations
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

// RxJS
import { of } from 'rxjs';
import { catchError, filter, map, pairwise, throttleTime } from 'rxjs/operators';

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
  isMobile = false; // rendered elements' height varies with screen width
  errorMsg = '';

  constructor(
    private ngZone: NgZone,
    private photoService: PhotoService
  ) {
    this.pageNumber = 1;
    this.photoList = [];
  }

  // Life cycles

  ngOnInit() {
    this.isMobile = window.innerWidth <= 576;
    this.loadMore();
  }

  ngAfterViewInit() {
    // Whenever the virtual scroller scrolls
    this.scroller.elementScrolled().pipe(
      // Get the scroll offset from the bottom
      map(() => this.scroller.measureScrollOffset('bottom')),
      // Get emitted values in pairs: [previousValue, currentValue]
      pairwise(),
      // Continue emission if movement is a downward scroll and list is near the bottom
      filter(([y1, y2]) => (y2 < y1 && (this.isMobile ? y2 < 272 : y2 < 368))),
      // Lets a value pass, but ignore next values for the next 200ms
      throttleTime(200)
    ).subscribe(() => {
      // Virtual scroller runs outside Angular zone, let API call reenter Angular zone
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
    this.photoService.getPhotos(this.pageNumber, 10)
      .pipe(
        catchError(errorMsg => {
          this.errorMsg = errorMsg;
          return of([]);
        })
      )
      .subscribe(photos => {
        if (photos.length) {
          this.photoList = this.photoList.concat(photos);
          this.pageNumber++;
          this.errorMsg = '';
        }
      });
  }
}
