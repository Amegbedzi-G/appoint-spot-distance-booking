
import React from 'react';
import { Service } from '@/contexts/ServiceContext';

interface ServiceSummaryProps {
  service: Service;
  mockDistance: number;
  mockPrice: number;
}

const ServiceSummary: React.FC<ServiceSummaryProps> = ({ 
  service, 
  mockDistance, 
  mockPrice 
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-medium mb-2">Service Summary</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Service:</div>
        <div className="font-medium">{service.name}</div>
        
        <div>Base Price:</div>
        <div className="font-medium">${service.basePrice.toFixed(2)}</div>
        
        <div>Distance:</div>
        <div className="font-medium">{mockDistance.toFixed(1)} km</div>
        
        <div>Distance Fee:</div>
        <div className="font-medium">${(mockDistance * service.pricePerKm).toFixed(2)}</div>
        
        <div className="text-lg">Total:</div>
        <div className="text-lg font-bold">${mockPrice.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ServiceSummary;
