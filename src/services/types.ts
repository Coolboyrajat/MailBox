export interface Message {
    id: string;
    from?: {
      address: string;
      name?: string;
    };
    to?: {
      address: string;
      name?: string;
    }[];
    subject?: string;
    intro?: string;
    text?: string;
    html?: string;
    createdAt: string;
    updatedAt?: string;
    seen?: boolean;
  }
  
  export interface StoredToken {
    token: string;
    accountId: string;
    email: string;
    timestamp: number;
  }
  
  export interface ServiceInfo {
    id: string;
    name: string;
    icon: string;
  }
  