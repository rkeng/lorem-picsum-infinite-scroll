// Foundations
import { Component, Input, OnInit } from '@angular/core';

// Models
import { Photo } from 'src/app/models/photo.model';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() photo!: Photo;

  constructor() { }

  ngOnInit(): void {
  }

  get blurredUrl() {
    return `url(https://picsum.photos/id/${this.photo.id}/456/304?blur=5)`;
  }

}
