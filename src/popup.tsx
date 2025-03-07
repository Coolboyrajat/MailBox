import React, { useEffect, useState } from 'react';
import "~/styles/global.css";

import { MailTmService } from '~/services/MailTmService';
import { TempMailService } from '~/services/TempMailService';
import { TempMailoService } from '~/services/TempMailoService';
import { Message, ServiceInfo } from '~/services/types';
import { MailService } from '~/services/MailService';

import ServiceButton from '~/components/ServiceButton';
import AccountInfo from '~/components/AccountInfo';
import EmailList from '~/components/EmailList';
import EmailView from '~/components/EmailView';

// Import platform icons
import mailTmIcon from '~/assets/icons/platforms/mail-tm.png';
import tempMailIcon from '~/assets/icons/platforms/temp-mail.png';
import tempMailoIcon from '~/assets/icons/platforms/tempmailo.png';

function IndexPopup() {
  const [services] = useState<ServiceInfo[]>([
    { id: 'mail-tm', name: 'mail.tm', icon: mailTmIcon },
    { id: 'temp-mail', name: 'TEMPMAIL', icon: tempMailIcon },
    { id: 'tempmailo', name: 'TEMPMAILO', icon: tempMailoIcon }
  ]);

  const [currentService, setCurrentService] = useState<MailService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleServiceSelect = async (serviceId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedMessage(null);
    
    let service: MailService;
    
    switch (serviceId) {
      case 'mail-tm':
        service = new MailTmService();
        break;
      case 'temp-mail':
        service = new TempMailService();
        break;
      case 'tempmailo':
        service = new TempMailoService();
        break;
      default:
        setErrorMessage('Invalid service selected');
        setIsLoading(false);
        return;
    }
    
    try {
      const initialized = await service.initialize();
      
      if (initialized) {
        setCurrentService(service);
        await fetchEmails(service);
      } else {
        setErrorMessage('Could not initialize service. Please try again.');
      }
    } catch (error) {
      console.error('Error selecting service:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmails = async (service: MailService) => {
    try {
      const fetchedMessages = await service.getMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setErrorMessage('Could not fetch emails');
    }
  };

  const handleRefresh = async () => {
    if (currentService) {
      setIsLoading(true);
      await fetchEmails(currentService);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (currentService) {
      await currentService.logout();
      setCurrentService(null);
      setMessages([]);
      setSelectedMessage(null);
    }
  };

  const handleSelectEmail = async (id: string) => {
    if (currentService) {
      setIsLoading(true);
      try {
        const message = await currentService.getMessage(id);
        if (message) {
          setSelectedMessage(message);
        }
      } catch (error) {
        console.error('Error fetching message:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleBackToInbox = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="w-96 bg-container rounded shadow overflow-hidden">
      <header className="p-4 text-center border-b border-border">
        <h1 className="text-xl font-semibold">MailBox</h1>
      </header>
      
      {!currentService ? (
        <>
          <div className="flex justify-around p-4 border-b border-border">
            {services.map((service) => (
              <ServiceButton 
                key={service.id}
                service={service}
                onClick={handleServiceSelect}
              />
            ))}
          </div>
          
          <div className="p-4 text-center text-text-light">
            {isLoading ? (
              <div>Connecting to service...</div>
            ) : errorMessage ? (
              <div className="text-red-500">{errorMessage}</div>
            ) : (
              <div>Select a service to get started</div>
            )}
          </div>
        </>
      ) : (
        <div className="p-4">
          {isLoading && !selectedMessage ? (
            <div className="text-center py-4">Loading...</div>
          ) : selectedMessage ? (
            <EmailView 
              message={selectedMessage}
              onBack={handleBackToInbox}
            />
          ) : (
            <>
              <AccountInfo 
                email={currentService.currentEmail || ''}
                onRefresh={handleRefresh}
                onLogout={handleLogout}
              />
              
              <div className="mb-3 flex justify-between items-center">
                <h2 className="font-medium">Inbox</h2>
                <span className="text-sm text-text-light">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <EmailList 
                messages={messages}
                onSelectEmail={handleSelectEmail}
              />
            </>
          )}
          
          {errorMessage && (
            <div className="text-center text-red-500 mt-4">
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IndexPopup;
