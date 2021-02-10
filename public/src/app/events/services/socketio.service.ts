import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import * as env from '../../../environments/environment'
import { MComment } from '../models/comments';
import { SimplePeer } from './peer-to-peer.service';
const socketUrl = env.environment.socketUrl;

@Injectable()
export class SocketioService {

  private socket: Socket;
  private isOwner: boolean;
  private presenterStream: MediaStream;
  private allConnected: SimplePeer[] = [];
  private receiverStream: SimplePeer;

  setupSocketConnection(eventId, array) {
    array.length = 0;
    this.socket = io(socketUrl + `?chosen=${eventId}`).connect();

    this.socket.on("owner joined", () => {
      this.socket.emit("request for offer", this.socket.id);
    });
  }

  receiveAll(array) {
    array.length = 0;
    this.socket.on("allComments", (message) => { array.push(...message) });
  }

  sendMessage(message) {
    this.socket.emit("comment", message);
  }

  newMessage(array) {
    return this.socket.on("message", (message) => { array.unshift(message) });
  }

  sendReply(id, reply) {
    this.socket.emit("reply", { commentId: id, reply });
  }

  sendDelete(commentId) {
    this.socket.emit("delete", { commentId });
  }

  onDelete(array: MComment[]) {
    return this.socket.on("delete", (message) => {
      array.forEach((comment, index) => {
        if (comment._id === message._id) {
          array.splice(index, 1);
        }
      });
    });
  }

  newReply(array) {
    return this.socket.on("reply", (reply) => {
      array.forEach((comment) => {
        if (comment._id === reply._id) {
          comment.replies = reply.replies
        }
      });
    });
  }

  closeConnection() {
    this.socket.close();
  }

  videoConnection(isOwner, videoEl) {

    this.isOwner = isOwner;

    if (isOwner === true) {

      navigator.mediaDevices.getUserMedia({ "video": true, 'audio': true })
        .then((stream) => {
          this.presenterStream = stream;
          videoEl.srcObject = stream;

          this.socket.emit("owner joined", this.socket.id);
          this.socket.on("request for offer", joinerId => {
            const peerInstance = new SimplePeer(this.socket, videoEl, this.presenterStream)
            peerInstance.callUser(joinerId)
            this.allConnected.push(peerInstance);
          }
          );
          this.socket.on("newUser", userId => {
            const peerInstance = new SimplePeer(this.socket, videoEl, this.presenterStream)
            peerInstance.callUser(userId)
            this.allConnected.push(peerInstance);
          })
        })
        .catch((error) => videoEl.innerHTML = 'Error opening video camera.' + error);
    } else {
      this.receiverStream = new SimplePeer(this.socket, videoEl);
      this.receiverStream.createPeer(null);
      this.socket.emit("newUser", this.socket.id);
      this.socket.on("stop-media", () => {
        this.stop(videoEl);
      });
    }

    this.socket.on("stream state change", (command: { trackType, state }): void => {
      command.trackType === "play"
        ? videoEl["streamPaused"] = !command.state
        : videoEl["streamMuted"] = !command.state;
    })
  }

  shareScreen(): void {
    this.allConnected.forEach((simplePeer: SimplePeer) => simplePeer.shareScreen());
  }

  streamState(trackType: string): void {
    this.allConnected.forEach((simplePeer: SimplePeer) => simplePeer.streamState(trackType));
  }

  stop(videoEl: HTMLMediaElement): void {

    if (this.allConnected.length > 0 && this.isOwner === true) {
      this.socket.emit("stop-media");
      this.allConnected.forEach((simplePeer: SimplePeer) => simplePeer.stopConnection(videoEl));
      return;
    } else if (this.isOwner === false) {
      this.receiverStream.stopConnection(videoEl);
      return;
    }
    //@ts-ignore
    videoEl.srcObject.getTracks().map(track => track.stop());;
  }
}