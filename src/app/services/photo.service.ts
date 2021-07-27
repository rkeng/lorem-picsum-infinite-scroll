// Foundations
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable } from 'rxjs';

// Models
import { Photo } from '../models/photo.model';

// Environment
import { environment } from '../../environments/environment';

const { baseUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) { }

  getPhotos(page: number, limit: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${baseUrl}?page=${page}&limit=${limit}`);
  }
}
