import { Component, OnInit } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { _ } from 'meteor/underscore';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Chats, Users } from '../../../../imports/collections';
import { User } from '../../../../imports/models';
import template from './new-chat.html';

@Component({
  template
})
export class NewChatComponent implements OnInit {
  searchPattern: BehaviorSubject<any>;
  senderId: string;
  users: Observable<User[]>;
  usersSubscription: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) {
    this.senderId = Meteor.userId();
    this.searchPattern = new BehaviorSubject(undefined);
  }

  ngOnInit() {
    this.observeSearchBar();
  }

  updateSubscription(newValue) {
    this.searchPattern.next(newValue);
  }

  observeSearchBar(): void {
    this.searchPattern.asObservable()
    // Prevents the search bar from being spammed
      .debounce(() => Observable.timer(1000))
      .forEach(() => {
        if (this.usersSubscription) {
          this.usersSubscription.unsubscribe();
        }

        this.usersSubscription = this.subscribeUsers();
      });
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

  subscribeUsers(): Subscription {
    // Fetch all users matching search pattern
    const subscription = MeteorObservable.subscribe('users', this.searchPattern.getValue());
    const autorun = MeteorObservable.autorun();

    return Observable.merge(subscription, autorun).subscribe(() => {
      this.users = this.findUsers();
    });
  }
  
  loadUsers(): void {
    // Fetch all users matching search pattern
    const subscription = MeteorObservable.subscribe('users');
    const autorun = MeteorObservable.autorun();

    Observable.merge(subscription, autorun).subscribe(() => {
      this.users = this.findUsers();
    });
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
