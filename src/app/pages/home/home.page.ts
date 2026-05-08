import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { VideoService, Video } from '../../services/video.service';
import { HlsVideoComponent } from '../../components/hls-video/hls-video.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, HlsVideoComponent],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  videos: Video[] = [];
  loading = true;
  error: string | null = null;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load videos. Please try again.';
        this.loading = false;
      },
    });
  }
}
