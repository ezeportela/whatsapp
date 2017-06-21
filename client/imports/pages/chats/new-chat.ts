import { Component, OnInit } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { _ } from 'meteor/underscore';
import { Observable, Subscription } from 'rxjs';
import { Chats, Users } from '../../../../imports/collections';
import { User } from '../../../../imports/models';
import template from './new-chat.html';

@Component({
  template
})
export class NewChatComponent implements OnInit {
  senderId: string;
  users: Observable<User[]>;
  usersSubscription: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) {
    this.senderId = Meteor.userId();
  }

  ngOnInit() {
    this.loadUsers();
  }

  addChat(user): void {
    MeteorObservable.call('addChat', user._id).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.handleError(e);
        });
      }
    });
  }

  loadUsers(): void {
    this.users = this.findUsers();
  }

  findUsers(): Observable<User[]> {
    // Find all belonging chats
    return Chats.find({
      memberIds: this.senderId
    }, {
      fields: {
        memberIds: 1
      }
    })
    // Invoke merge-map with an empty array in case no chat found
    .startWith([])
    .mergeMap((chats) => {
      // Get all userIDs who we're chatting with
      const receiverIds = _.chain(chats)
        .pluck('memberIds')
        .flatten()
        .concat(this.senderId)
        .value();

      // Find all users which are not in belonging chats
      return Users.find({
        _id: { $nin: receiverIds }
      })
      // Invoke map with an empty array in case no user found
      .startWith([]);
    });
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      buttons: ['OK'],
      message: e.message,
      title: 'Oops!'
    });

    alert.present();
  }
}
