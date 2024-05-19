import { NgModule, OnInit } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ChatBotService } from './chat-bot.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule implements OnInit{
  
  userInput: string = '';
  messages: { text: string, user: boolean }[] = [];
  isDataLoaded: boolean = false;

  constructor(private chatService: ChatBotService) {}
  ngOnInit() {
    this.chatService.loadChatData().subscribe(() => {
      this.isDataLoaded = true;
    });
  }

  sendMessage() {
    console.log(this.userInput);
    if (this.userInput.trim() !== '' && this.isDataLoaded) {
      this.messages.push({ text: this.userInput, user: true });
      const botResponse = this.chatService.getResponse(this.userInput);
      this.messages.push({ text: botResponse, user: false });
      this.userInput = '';
    } else if (!this.isDataLoaded) {
      this.messages.push({ text: "Data is still loading. Please wait.", user: false });
    }
  }
}
