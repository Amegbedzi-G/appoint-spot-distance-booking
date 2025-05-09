
import { useState } from 'react';
import { useServices, Service } from '@/contexts/ServiceContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Edit, Trash2, Clock, DollarSign, Image } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ServiceFormData {
  name: string;
  description: string;
  basePrice: string;
  pricePerKm: string;
  duration: string;
  image: string;
}

const defaultFormData: ServiceFormData = {
  name: '',
  description: '',
  basePrice: '',
  pricePerKm: '',
  duration: '',
  image: '',
};

const ManageServicesPage = () => {
  const { services, addService, updateService, deleteService } = useServices();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>(defaultFormData);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddNewClick = () => {
    setFormData(defaultFormData);
    setSelectedServiceId(null);
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      basePrice: service.basePrice.toString(),
      pricePerKm: service.pricePerKm.toString(),
      duration: service.duration.toString(),
      image: service.image,
    });
    setSelectedServiceId(service.id);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.basePrice || !formData.pricePerKm || !formData.duration) {
      toast.error("All fields except image are required");
      return;
    }
    
    try {
      // Prepare service data
      const serviceData = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        pricePerKm: parseFloat(formData.pricePerKm),
        duration: parseInt(formData.duration),
        image: formData.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3',
      };
      
      if (selectedServiceId) {
        // Update existing service
        updateService(selectedServiceId, serviceData);
      } else {
        // Add new service
        addService(serviceData);
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      setFormData(defaultFormData);
      setSelectedServiceId(null);
      
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    }
  };
  
  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };
  
  return (
    <div className="page-container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No services available</p>
          <Button onClick={handleAddNewClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Service
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Service Name</TableHead>
                <TableHead className="hidden md:table-cell">Base Price</TableHead>
                <TableHead className="hidden md:table-cell">Per KM Rate</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    {service.name}
                    <div className="text-xs text-gray-500 md:hidden">
                      ${service.basePrice} · ${service.pricePerKm}/km · {service.duration}min
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">${service.basePrice}</TableCell>
                  <TableCell className="hidden md:table-cell">${service.pricePerKm}/km</TableCell>
                  <TableCell className="hidden md:table-cell">{service.duration} min</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(service)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        onClick={() => handleDeleteClick(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Service Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {selectedServiceId ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              {selectedServiceId 
                ? 'Update the service details below to modify this service.'
                : 'Fill in the service details below to add it to your offerings.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Service Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Home Cleaning"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium">
                  Description*
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the service"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="basePrice" className="text-right text-sm font-medium flex items-center justify-end">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Base Price*
                </label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 50"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="pricePerKm" className="text-right text-sm font-medium flex items-center justify-end">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Price Per KM*
                </label>
                <Input
                  id="pricePerKm"
                  name="pricePerKm"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 2"
                  value={formData.pricePerKm}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="duration" className="text-right text-sm font-medium flex items-center justify-end">
                  <Clock className="h-4 w-4 mr-1" />
                  Duration (mins)*
                </label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 60"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="image" className="text-right text-sm font-medium flex items-center justify-end">
                  <Image className="h-4 w-4 mr-1" />
                  Image URL
                </label>
                <Input
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedServiceId ? 'Update Service' : 'Add Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the service "{serviceToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageServicesPage;
