import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CreateComponent } from './create/create.component';
import { EventComponent } from './event/event.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { EventRoutingModule } from './event-routing/event-routing.module';
import { EventCardComponent } from './event-card/event-card.component';
import { EventsService } from './services/events.service';
import { CommentComponent } from './comment/comment.component';
import { ClickStopPropagation } from './stop.propagation';
import { SocketioService } from './services/socketio.service';
import { VideoComponent } from './video/video.component';
import { CoreModule } from '../core/core.module';
import { VideoControlsComponent } from './video-controls/video-controls.component';
import { SimplePeer } from './services/peer-to-peer.service';


@NgModule({
  declarations: [
    CreateComponent,
    EventComponent,
    MyEventsComponent,
    EventCardComponent,
    CommentComponent,
    ClickStopPropagation,
    VideoComponent,
    VideoControlsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    EventRoutingModule,
    DragDropModule,
  ],
  providers: [EventsService, SocketioService, SimplePeer],
  exports: [EventCardComponent]
})
export class EventsModule { }
