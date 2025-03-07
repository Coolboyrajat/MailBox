import React, { useState } from 'react';
import { FiCopy, FiRefreshCw, FiLogOut } from 'react-icons/fi';

interface AccountInfoProps {
  email: string;
  onRefresh: () => void;
  onLogout: () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ email, onRefresh, onLogout }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center bg-background p-2 rounded-button mb-3">
        <span className="text-sm truncate mr-2">{email}</span>
        <button 
          className="icon-button flex items-center"
          onClick={handleCopy}
        >
          <FiCopy className="mr-1" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="action-button flex items-center"
          onClick={onRefresh}
        >
          <FiRefreshCw className="mr-1" />
          Refresh
        </button>
        
        <button 
          className="action-button flex items-center bg-red-500 hover:bg-red-600"
          onClick={onLogout}
        >
          <FiLogOut className="mr-1" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;

// src/components/EmailList.tsx
import React from 'react';
import { Message } from '~/services/types';

interface EmailListProps {
  messages: Message[];
  onSelectEmail: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ messages, onSelectEmail }) => {
  if (messages.length === 0) {
    return (
      <div className="text-center text-text-light py-6">
        No emails yet. Waiting for new messages...
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {messages.map((message) => (
        <div 
          key={message.id}
          className="p-3 border-b border-border cursor-pointer hover:bg-button-hover"
          onClick={() => onSelectEmail(message.id)}
        >
          <div className="font-medium mb-1">{message.subject || '(No subject)'}</div>
          <div className="text-sm text-text-light truncate">
            {message.intro || 'No preview available'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;