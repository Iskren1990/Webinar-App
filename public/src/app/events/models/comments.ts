import { MReply } from './replies';

export class MComment {
    tempId: String;
    owner: String;
    comment: String;
    eventId: String;
    expireAt?: Number | string;
    replies?: MReply[];
    _id?: String;
    constructor({username, comment, eventId, tempId, expireAt}){
        this.comment = comment;
        this.owner = username;
        this.eventId = eventId;
        this.tempId = tempId;
        this.expireAt = expireAt;
    }
}