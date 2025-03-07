import { Message } from './types';

export abstract class MailService {
  currentEmail: string | null = null;
  messages: Message[] = [];
  currentService: string | null = null;

  abstract initialize(): Promise<boolean>;
  abstract getMessages(): Promise<Message[]>;
  abstract getMessage(id: string): Promise<Message | null>;
  abstract deleteMessage(id: string): Promise<boolean>;
  
  async logout(): Promise<boolean> {
    this.currentEmail = null;
    this.messages = [];
    this.currentService = null;
    
    return true;
  }
}