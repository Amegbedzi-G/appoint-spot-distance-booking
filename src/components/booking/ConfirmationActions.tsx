
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const ConfirmationActions = () => {
  const navigate = useNavigate();

  return (
    <CardFooter className="flex flex-col sm:flex-row gap-2 border-t pt-6">
      <Button 
        variant="outline" 
        className="w-full sm:w-auto"
        onClick={() => navigate('/')}
      >
        View Dashboard
      </Button>
      <Button 
        className="w-full sm:w-auto"
        onClick={() => navigate('/services')}
      >
        Book Another Service <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardFooter>
  );
};

export default ConfirmationActions;
