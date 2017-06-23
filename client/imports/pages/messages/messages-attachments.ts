import { Component } from '@angular/core';
import { AlertController, Platform, ModalController, ViewController } from 'ionic-angular';
import template from './messages-attachments.html';
import { MessageType } from '../../../../imports/models';
import { NewLocationMessageComponent } from './location-message';

@Component({
  template
})
export class MessagesAttachmentsComponent {
  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private viewCtrl: ViewController,
    private modelCtrl: ModalController
  ) {}

  sendLocation(): void {
    const locationModal = this.modelCtrl.create(NewLocationMessageComponent);
    locationModal.onDidDismiss((location) => {
      if (!location) {
        this.viewCtrl.dismiss();

        return;
      }

      this.viewCtrl.dismiss({
        messageType: MessageType.LOCATION,
        selectedLocation: location
      });
    });

    locationModal.present();
  }
}
