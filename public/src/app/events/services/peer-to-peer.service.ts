import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import * as env from '../../../environments/environment'

const constrains = env.environment.constrains;


@Injectable({
  providedIn: 'root'
})
export class SimplePeer {

  private userConnection: RTCPeerConnection;
  private socket: Socket;
  private videoEl: HTMLMediaElement
  private userID: String;
  private presenterStream?: MediaStream;

  constructor(socket, videoEl, presenterStream?) {
    this.userConnection;
    this.presenterStream = presenterStream;
    this.socket = socket;
    this.videoEl = videoEl;
    this.userID;
  }

  callUser(userID: string): void {
    this.userConnection = this.createPeer(userID);
    this.presenterStream
      .getTracks()
      .forEach(track => { this.userConnection.addTrack(track, this.presenterStream) });
  }

  createPeer = (userID: string | null): RTCPeerConnection => {
    // extract as  
    const peer = new RTCPeerConnection(constrains);
    peer["target"] = userID;
    peer.ontrack = this.handleTrackEvent;
    peer.onnegotiationneeded = () => this.handleNegotiationNeededEvent(peer["target"]);
    peer.onicecandidate = this.handleOnICECandidateEvent;

    this.socket.on("offer", this.handleReceivedOffer);
    this.socket.on("answer", this.handleAnswer);
    this.socket.on("ice-candidate", this.handleNewICECandidateMsg);

    return peer;
  }

  handleNegotiationNeededEvent(userID: string): void {
    this.userConnection.createOffer().then(offer => {
      return this.userConnection.setLocalDescription(offer);
    }).then(() => {
      const payload = {
        target: userID,
        caller: this.socket.id,
        sdp: this.userConnection.localDescription
      };
      this.socket.emit("offer", payload);
    }).catch(console.log);
  }

  handleReceivedOffer = (incoming): void => {

    this.userConnection = this.createPeer(incoming.caller);
    const desc = new RTCSessionDescription(incoming.sdp);
    this.userConnection.setRemoteDescription(desc).then(() => {
    }).then(() => {
      return this.userConnection.createAnswer();
    }).then(answer => {
      return this.userConnection.setLocalDescription(answer);
    }).then(() => {
      const payload = {
        target: incoming.caller,
        caller: this.socket.id,
        sdp: this.userConnection.localDescription
      }

      this.socket.emit("answer", payload);
    }).catch(console.log)
  }

  handleAnswer = (message): void => {
    if (this.userConnection["target"] === message.caller) {
      const desc = new RTCSessionDescription(message.sdp);
      this.userConnection.setRemoteDescription(desc).catch(console.log);
    }
  }

  handleOnICECandidateEvent = (e: RTCPeerConnectionIceEvent): void => {
    if (e.candidate) {
      const payload = { candidate: e.candidate, target: this.userConnection["target"], caller: this.socket.id };
      this.socket.emit("ice-candidate", payload);
    }
  }

  handleNewICECandidateMsg = (incoming): void => {
    if (this.userConnection["target"] === incoming.caller) {
      const candidate = new RTCIceCandidate(incoming.candidate);
      this.userConnection.addIceCandidate(candidate)
        .catch(e => console.log(e));
    }
  }

  handleTrackEvent = (e): void => {
    this.videoEl.srcObject = e.streams[0];
  };

  public shareScreen(): void {
    // TS issue https://github.com/microsoft/TypeScript/issues/33232
    // @ts-ignore
    const userVideo: MediaStream = this.videoEl.srcObject;
    console.log("peer-to-peer.service - fix share screen functionality");
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(media => {
      const screenTrack = media.getTracks()[0];

      // replace the screen stare track with the video track
      screenTrack.onended = () => {
        this.userConnection
          .getSenders()
          .find(track => track.track.kind === "video")
          .replaceTrack(userVideo.getTracks().find(track => track.kind === "video"))
      }

      // replace the video track with screen share one
      this.userConnection
        .getSenders()
        .find(track => track.track.kind === "video")
        .replaceTrack(screenTrack)
    }).catch(console.log);
  }

  public streamState(trackType: string): void {

    this.userConnection
      .getSenders()
      .find(track => {
        if (track.track.kind === trackType) {
          track.track.enabled = !track.track.enabled;
          trackType === "audio" ? trackType = "muted" : trackType = "play";
          this.socket.emit("stream state change", { trackType, state: track.track.enabled });
        }
      })
  }


  public stopConnection(videoEl: HTMLMediaElement): void {

    if (!!this.userConnection === true) {
      this.userConnection.getSenders()
        .map(track => {
          if (track.track) {
            track.track.enabled = false;
            track.track.stop();
          }
        });
        
        Promise.resolve()
        .then(() => {
          // @ts-ignore
          videoEl.srcObject.getTracks().map(track => track.stop());
        })
        .then(() => {
          this.userConnection.ontrack = null;
          this.userConnection.onicecandidate = null;
          this.userConnection.onnegotiationneeded = null;
          this.userConnection.close();
          this.userConnection = null;
        })
        .catch(console.log);
    }
  }
}
