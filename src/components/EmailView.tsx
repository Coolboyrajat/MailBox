import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Message } from '~/services/types';

interface EmailViewProps {
  message: Message;
  onBack: () => void;
}

const EmailView: React.FC<EmailViewProps> = ({ message, onBack }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <div className="mb-4">
        <button 
          className="icon-button flex items-center mb-2"
          onClick={onBack}
        >
          <FiArrowLeft className="mr-1" />
          Back to Inbox
        </button>
        
        <div className="text-lg font-medium mb-2">
          {message.subject || '(No subject)'}
        </div>
        
        <div className="flex justify-between text-sm text-text-light">
          <span>From: {message.from?.address || 'Unknown'}</span>
          <span>{formatDate(message.createdAt)}</span>
        </div>
      </div>
      
      <div 
        className="max-h-80 overflow-y-auto leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: message.html || message.text || 'No content' 
        }}
      />
    </div>
  );
};

export default EmailView;
