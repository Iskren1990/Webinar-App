import { OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.css']
})

export class VideoControlsComponent implements OnInit, OnDestroy {

  @Input() isOwner: boolean;
  @Input() videoElement: HTMLMediaElement;
  public isMuted: boolean = true;
  public isPiPEnabled: boolean = false;
  public isPaused: boolean = true;
  public isFullScreen: boolean = window["fullScreen"];
  public isDisabled: boolean = false;

  constructor(private socketService: SocketioService) { }

  ngOnInit() {
    this.isPiPEnabled = "pictureInPictureEnabled" in document;
  }

  ngOnDestroy() {
    if (this.isOwner === true) this.stopAll();
  }

  toggleFullScreenControls() {
    if(document["mozFullScreenElement"]) {
      document["mozFullScreenElement"].controls = window["fullScreen"]
      document["mozFullScreenElement"].onfullscreenchange = () => this.videoElement.controls = window["fullScreen"]
    }
  }

  shareScreenFn() {
    this.socketService.shareScreen();
  }

  playPause() {
    this.isPaused = this.videoElement.paused;

    if (this.isOwner) this.socketService.streamState("video");
    
    this.videoElement.paused === true
      ? this.videoElement.play()
      : this.videoElement.pause();
  }

  mute() {
    this.isMuted = !this.isMuted;
    this.videoElement.muted = !this.videoElement.muted

    this.isOwner
      ? this.socketService.streamState("audio")
      : this.videoElement.muted = !this.videoElement.muted;

  }

  // stops the broadcast if initiated
  stopAll() {
    // this.isDisabled = true;
    this.socketService.stop(this.videoElement);
  }

  fullScreen() {
    this.videoElement.requestFullscreen()
      .then(() =>this.toggleFullScreenControls())
      .catch(console.log);
  }

  pictureInPicture() {
    // TS issue https://github.com/microsoft/TypeScript/issues/33232
    // @ts-ignore
    document.pictureInPictureElement
      // @ts-ignore
      ? document.exitPictureInPicture().catch(console.log)
      // @ts-ignore
      : this.videoElement.requestPictureInPicture().catch(console.log);

  }
}

