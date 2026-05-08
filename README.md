# ionic-hls-video-player

A reusable HLS video streaming component for Ionic Capacitor apps, built with Angular and [hls.js](https://github.com/video-dev/hls.js).

Supports:
- **iOS native** — native HLS via Safari WebView (no hls.js)
- **Android native** — hls.js via Chromium WebView MSE
- **Web (Chrome/Firefox)** — hls.js via MSE
- **Web (Safari)** — native HLS fallback

📖 Full tutorial on [habitualcs.io](https://habitualcs.io)

---

## Prerequisites

- Node.js >= 18
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`
- Capacitor CLI: included via `@capacitor/core`

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/deepakrout/ionic-hls-video-player.git
cd ionic-hls-video-player

# 2. Install dependencies
npm install

# 3. Run in browser
ionic serve

# 4. Build and sync to native
ionic build
npx cap sync

# 5. Open in Xcode or Android Studio
npx cap open ios
npx cap open android
```

---

## Project Structure

```
src/
  app/
    components/
      hls-video/
        hls-video.component.ts     # Core HLS player logic
        hls-video.component.html   # Video element template
        hls-video.component.scss   # Component styles
    services/
      video.service.ts             # Fetches video manifest from remote CDN
    pages/
      home/
        home.page.ts
        home.page.html
  environments/
    environment.ts
    environment.prod.ts
capacitor.config.ts
angular.json
package.json
```

---

## Usage

```html
<app-hls-video
  [src]="'https://your-cdn.example.com/videos/stream.m3u8'"
  [poster]="'https://your-cdn.example.com/thumbnails/thumb.jpg'">
</app-hls-video>
```

Or load a list of videos from a remote JSON manifest:

```typescript
// home.page.ts
this.videoService.getVideos().subscribe(videos => {
  this.videos = videos;
});
```

---

## CDN Requirements

Your CDN must expose these CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Content-Range, Accept-Ranges
```

And serve correct content types:
- `.m3u8` → `application/vnd.apple.mpegurl`
- `.ts` → `video/MP2T`

---

## License

MIT
