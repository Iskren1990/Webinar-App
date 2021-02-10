import { AfterViewInit, Output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, Input, ViewChild } from '@angular/core';
import { IUser } from 'src/app/user/models/user';
import { SocketioService } from '../services/socketio.service';
import { VideoControlsComponent } from '../video-controls/video-controls.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements AfterViewInit {

  @ViewChild("videoElement") videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild(VideoControlsComponent) videoControls: VideoControlsComponent;
  @Input() isOwner: Boolean;
  @Input() user: IUser | any;
  public isDisabled: boolean = true;

  constructor(private socketService: SocketioService) { }

  ngAfterViewInit(): void { 
    this.socketService.videoConnection(this.isOwner, this.videoElement.nativeElement);
  }
}
