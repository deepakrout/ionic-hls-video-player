import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Video {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class VideoService {
  /**
   * Replace with your CDN URL pointing to a JSON array of Video objects.
   * The JSON should follow the Video interface shape above.
   */
  private readonly CDN_MANIFEST_URL = 'https://your-cdn.example.com/data/videos.json';

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.CDN_MANIFEST_URL).pipe(
      catchError(err => {
        console.error('VideoService: failed to load video manifest', err);
        return throwError(() => err);
      })
    );
  }
}
