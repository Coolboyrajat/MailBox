import browser from 'webextension-polyfill';
import { MailService } from './MailService';
import { Message, StoredToken } from './types';

export class MailTmService extends MailService {
  private apiBase = 'https://api.mail.tm';
  private token: string | null = null;
  private accountId: string | null = null;

  constructor() {
    super();
    this.currentService = 'mail-tm';
  }

  async initialize(): Promise<boolean> {
    const storedToken = await this.getStoredToken();
    if (storedToken) {
      this.token = storedToken.token;
      this.accountId = storedToken.accountId;
      this.currentEmail = storedToken.email;
      return true;
    }

    // Create new account
    try {
      const domains = await this.getDomains();
      if (!domains || domains.length === 0) {
        throw new Error('No domains available');
      }

      const domain = domains[0].domain;
      const username = this.generateUsername();
      const email = `${username}@${domain}`;
      const password = this.generatePassword();

      const account = await this.createAccount(email, password);
      if (!account) {
        throw new Error('Failed to create account');
      }

      const auth = await this.login(email, password);
      if (!auth) {
        throw new Error('Failed to log in to new account');
      }

      this.currentEmail = email;
      return true;
    } catch (error) {
      console.error('MailTM initialization error:', error);
      return false;
    }
  }

  async getDomains(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBase}/domains`);
      const data = await response.json();
      return data.hydra_member || [];
    } catch (error) {
      console.error('Error fetching domains:', error);
      return [];
    }
  }

  async createAccount(address: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, password })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating account:', error);
      return null;
    }
  }

  async login(address: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, password })
      });
      
      const data = await response.json();
      
      if (data.token) {
        this.token = data.token;
        this.accountId = data.id;
        
        // Store in browser storage
        await browser.storage.local.set({
          mailTmToken: {
            token: this.token,
            accountId: this.accountId,
            email: address,
            timestamp: Date.now()
          }
        });
        
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }

  async getMessages(): Promise<Message[]> {
    if (!this.token) {
      return [];
    }

    try {
      const response = await fetch(`${this.apiBase}/messages`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      const data = await response.json();
      this.messages = data.hydra_member || [];
      return this.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async getMessage(id: string): Promise<Message | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiBase}/messages/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching message:', error);
      return null;
    }
  }

  async deleteMessage(id: string): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch(`${this.apiBase}/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    // Clear stored token
    await browser.storage.local.remove('mailTmToken');
    
    // Clear instance variables
    this.token = null;
    this.accountId = null;
    
    return super.logout();
  }

  private async getStoredToken(): Promise<StoredToken | null> {
    try {
      const data = await browser.storage.local.get('mailTmToken');
      if (data.mailTmToken) {
        // Check if token is expired (24 hours)
        const isExpired = Date.now() - data.mailTmToken.timestamp > 24 * 60 * 60 * 1000;
        return isExpired ? null : data.mailTmToken;
      }
      return null;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  private generateUsername(): string {
    return 'user_' + Math.random().toString(36).substring(2, 10);
  }

  private generatePassword(): string {
    return Math.random().toString(36).substring(2, 10) + 
           Math.random().toString(36).substring(2, 10);
  }
}
