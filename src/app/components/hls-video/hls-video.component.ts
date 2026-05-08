import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import Hls, { ErrorData } from 'hls.js';

@Component({
  selector: 'app-hls-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hls-video.component.html',
  styleUrls: ['./hls-video.component.scss'],
})
export class HlsVideoComponent implements AfterViewInit, OnDestroy {
  @Input() src!: string;
  @Input() poster?: string;
  @Input() autoplay = false;
  @Input() muted = false;

  @ViewChild('videoEl') videoRef!: ElementRef<HTMLVideoElement>;

  private hls: Hls | null = null;

  ngAfterViewInit(): void {
    this.initPlayer();
  }

  private initPlayer(): void {
    const video = this.videoRef.nativeElement;
    const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
    const isNative = Capacitor.isNativePlatform();

    // iOS: Safari has native HLS support — hls.js not needed
    if (isNative && platform === 'ios') {
      video.src = this.src;
      video.load();
      if (this.autoplay) video.play();
      return;
    }

    // Android WebView + Desktop browsers: use hls.js if MSE is available
    if (Hls.isSupported()) {
      this.hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1, // auto ABR quality selection
        debug: false,
      });

      this.hls.loadSource(this.src);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (this.autoplay) video.play();
      });

      this.hls.on(Hls.Events.ERROR, (_event, data: ErrorData) => {
        if (data.fatal) {
          this.handleFatalError(data);
        }
      });

      return;
    }

    // Fallback: Safari on desktop supports HLS natively
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.src;
      if (this.autoplay) video.play();
    }
  }

  private handleFatalError(data: ErrorData): void {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.warn('HLS: fatal network error — retrying...');
        this.hls?.startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.warn('HLS: fatal media error — attempting recovery...');
        this.hls?.recoverMediaError();
        break;
      default:
        console.error('HLS: unrecoverable error', data);
        this.hls?.destroy();
        break;
    }
  }

  ngOnDestroy(): void {
    this.hls?.destroy();
    this.hls = null;
  }
}
