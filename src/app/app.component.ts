import { Component } from '@angular/core';
import { ChatBotService } from './chat-bot.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chatBot';

  public userInput: string = '';
  public messages: { text: string, user: boolean }[] = [];
  public isDataLoaded: boolean = false;
  public chatActive: boolean = false; // To handle the chat toggle state

  constructor(private chatService: ChatBotService) {}

  ngOnInit() {
    this.chatService.loadChatData().subscribe(() => {
      this.isDataLoaded = true;
    });
  }

  async sendMessage() {
    console.log(this.userInput);
    if (this.userInput.trim() !== '' && this.isDataLoaded) {
      this.messages.push({ text: this.userInput, user: true });
      try {
        const botResponse = await this.chatService.getResponse(this.userInput);
        this.messages.push({ text: botResponse, user: false });
      } catch (error) {
        console.error("Error occurred while fetching bot response:", error);
        this.messages.push({ text: "An error occurred while processing your request. Please try again later.", user: false });
      }
      this.userInput = '';
    } else if (!this.isDataLoaded) {
      this.messages.push({ text: "Data is still loading. Please wait.", user: false });
    }
  }
  
  
  

  toggleChat() {
    this.chatActive = !this.chatActive;
  }
}
