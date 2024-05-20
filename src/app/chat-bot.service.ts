import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, model } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private chatData: any;
  // private readonly GeminiURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD3odXbQFR_BBs2hWBASOiavxhjc3Gyq4M'; // Replace this with your ChatGPT API endpoint
  private genarativeAI: GoogleGenerativeAI;
  constructor(private http: HttpClient) {
    this.genarativeAI = new GoogleGenerativeAI("AIzaSyD3odXbQFR_BBs2hWBASOiavxhjc3Gyq4M")
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
    return await this.generateResponseWithGemini(message);
  }

  async generateResponseWithGemini(message: string): Promise<string> {
    const json=this.chatData.intents;
    const prompt ="my shop name is MLT Holdings PVT LTD it is cosmetic shop, situated in nittambuwa open till 8.00am to night 8.00pm  some people ask some questions regarding cosmetics, and reagarding shop informations some peoples ask some un wanted questions not related to the cosmetics so if it is looks related to a cosmetic question can you give me a samll, prety and wise answer for that particular question ? if it is unwanted question or not related to cosmetics always tell sorry please kind to ask related to cosmetic problems and shop inquiries only in this time customer ask"+message+"the patterns are like this  ->  "+json
    // try {
    //   const headers = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'AIzaSyD3odXbQFR_BBs2hWBASOiavxhjc3Gyq4M' // Replace YOUR_GPT_API_KEY_HERE with your actual API key
    //   });
    //   const requestOptions = { headers: headers };
    //   const response = await this.http.post<any>(this.GeminiURL, { prompt: message }, requestOptions).toPromise();
    //   return response.choices[0].text.trim(); // Assuming the response from ChatGPT API contains a 'text' field
    // } catch (error) {
    //   console.error("Error occurred while fetching response from ChatGPT:", error);
    //   return "Sorry, I'm still learning. Can you please rephrase your question?";
    // }

    try {
       const model = this.genarativeAI.getGenerativeModel({model:'gemini-pro'});
       const result = await model.generateContent(prompt);
       const response = await result.response;
       console.log(response);
       const responeText = response.text();
       console.log(responeText);
       return responeText;

      } catch (error) {
        console.error("Error occurred while fetching response from ChatGPT:", error);
        return "Sorry, I'm still learning. Can you please rephrase your question?";
      }




  }
}
