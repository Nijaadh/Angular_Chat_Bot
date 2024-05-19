import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private chatData: any;

  constructor(private http: HttpClient) {
    this.loadChatData().subscribe(data => {
      this.chatData = data;
    });
  }

  loadChatData(): Observable<any> {
    return this.http.get('assets/chat-data.json');
  }

  async getResponse(message: string): Promise<string> {
    if (!this.chatData) {
      return "I'm sorry, I don't have enough data right now. Please try again later.";
    }

    const intents = this.chatData.intents;
    for (let intent of intents) {
      for (let pattern of intent.patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(message)) {
          const responses = intent.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // If no suitable response found in the JSON data, delegate to ChatGPT
    return await this.generateResponseWithChatGPT(message);
  }

  async generateResponseWithChatGPT(message: string): Promise<string> {
    // Here, you would call your ChatGPT service or API to generate a response
    // For demonstration purposes, let's return a placeholder response
    return "Sorry, I'm still learning. Can you please rephrase your question?";
  }
}
