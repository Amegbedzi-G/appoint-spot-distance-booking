
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  duration: number; // in minutes
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceContextType {
  services: Service[];
  isLoading: boolean;
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => Service | undefined;
}

// Initial services data for demo
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Home Cleaning',
    description: 'Professional home cleaning service with eco-friendly products',
    basePrice: 50,
    pricePerKm: 2,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Plumbing Repair',
    description: 'Expert plumbing repair services by certified professionals',
    basePrice: 75,
    pricePerKm: 3,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Electrical Service',
    description: 'Electrical repair, installation and maintenance services',
    basePrice: 85,
    pricePerKm: 3,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedServices = localStorage.getItem('appointmentBookingServices');
    if (savedServices) {
      try {
        setServices(JSON.parse(savedServices));
      } catch (error) {
        console.error('Failed to parse saved services:', error);
        setServices(initialServices);
      }
    } else {
      setServices(initialServices);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('appointmentBookingServices', JSON.stringify(services));
    }
  }, [services, isLoading]);

  const addService = (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: Service = {
      ...service,
      id: `service-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setServices((prev) => [...prev, newService]);
    toast.success(`${service.name} service added successfully`);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, ...updates, updatedAt: new Date().toISOString() }
          : service
      )
    );
    toast.success("Service updated successfully");
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
    toast.success("Service deleted successfully");
  };

  const getServiceById = (id: string) => {
    return services.find((service) => service.id === id);
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        isLoading,
        addService,
        updateService,
        deleteService,
        getServiceById,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
