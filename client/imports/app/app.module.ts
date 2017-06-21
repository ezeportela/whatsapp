import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';
import { ChatsPage } from '../pages/chats/chats';
import { ChatsOptionsComponent } from '../pages/chats/chats-options';
import { NewChatComponent } from '../pages/chats/new-chat';
import { PhoneService } from '../services/phone';
import { MessagesPage } from '../pages/messages/messages';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { VerificationPage } from '../pages/verification/verification';
import { ProfilePage } from '../pages/profile/profile';

@NgModule({
  declarations: [
    MyApp,
    ChatsPage,
    MessagesPage,
    LoginPage,
    VerificationPage,
    ProfilePage,
    ChatsOptionsComponent,
    NewChatComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatsPage,
    MessagesPage,
    LoginPage,
    VerificationPage,
    ProfilePage,
    ChatsOptionsComponent,
    NewChatComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PhoneService
  ]
})
export class AppModule {}
