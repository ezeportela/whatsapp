import { Component, OnInit } from '@angular/core';
import { MessagesPage } from '../messages/messages';
import * as Moment from 'moment';
import { NavController, PopoverController } from 'ionic-angular';
import { ChatsOptionsComponent } from './chats-options';
import { Observable } from 'rxjs';
import { Chats, Messages } from '../../../../imports/collections';
import { Chat, MessageType } from '../../../../imports/models';
import template from './chats.html';

@Component({
  template
})
export class ChatsPage implements OnInit {
  chats;

  constructor(private navCtrl: NavController,
              private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    this.chats = Chats
      .find({})
      .mergeMap((chats: Chat[]) =>
        Observable.combineLatest(
          ...chats.map((chat: Chat) =>
            Messages
              .find({chatId: chat._id})
              .startWith(null)
              .map(messages => {
                if (messages) chat.lastMessage = messages[0];
                return chat;
              })
          )
        )
      ).zone();
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
      cssClass: 'options-popover chats-options-popover'
    });

    popover.present();
  }
  
  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }

  removeChat(chat: Chat): void {
    Chats.remove({_id: chat._id}).subscribe(() => {});
  }
}
