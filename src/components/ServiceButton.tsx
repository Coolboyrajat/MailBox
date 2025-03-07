import React from 'react';
import { ServiceInfo } from '~/services/types';

interface ServiceButtonProps {
  service: ServiceInfo;
  onClick: (serviceId: string) => void;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ service, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center p-3 rounded-button cursor-pointer transition-colors hover:bg-button-hover"
      onClick={() => onClick(service.id)}
    >
      <img 
        src={service.icon} 
        alt={service.name} 
        className="w-10 h-10 object-contain mb-2" 
      />
      <span className="text-xs font-medium">{service.name}</span>
    </div>
  );
};

export default ServiceButton;
