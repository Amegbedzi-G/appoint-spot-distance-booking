
import { Service } from '@/contexts/ServiceContext';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  service: Service;
  showBookButton?: boolean;
}

const ServiceCard = ({ service, showBookButton = true }: ServiceCardProps) => {
  return (
    <Card className="card-hover h-full flex flex-col overflow-hidden border border-gray-200">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="text-sm text-gray-600 flex-grow">
        <p className="mb-4">{service.description}</p>
        
        <div className="flex flex-wrap gap-y-2">
          <div className="flex items-center w-full sm:w-1/2 text-gray-700">
            <DollarSign className="h-4 w-4 mr-1 text-brand-500" />
            <span className="font-medium">${service.basePrice}</span>
            <span className="text-xs ml-1">(base price)</span>
          </div>
          
          <div className="flex items-center w-full sm:w-1/2 text-gray-700">
            <Clock className="h-4 w-4 mr-1 text-brand-500" />
            <span>{service.duration} min</span>
          </div>
        </div>
      </CardContent>
      
      {showBookButton && (
        <CardFooter className="pt-2">
          <Link to={`/book/${service.id}`} className="w-full">
            <Button className="w-full" size="sm">
              Book Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default ServiceCard;
