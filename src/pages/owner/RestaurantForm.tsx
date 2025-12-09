import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { restaurantApi } from '@/db/api';
import { Restaurant, RestaurantType } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import OwnerLayout from '@/components/owner/OwnerLayout';

export default function RestaurantForm() {
  const { id } = useParams();
  const { profile } = useAuth();
  const { refreshRestaurant } = useRestaurant();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact_details: '',
    business_info: '',
    restaurant_type: 'both' as RestaurantType,
    description: '',
    phone: '',
    address: '',
  });
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [cuisineInput, setCuisineInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (id) {
      loadRestaurant();
    }
  }, [id]);

  const loadRestaurant = async () => {
    if (!id) return;
    try {
      const restaurant = await restaurantApi.getRestaurantById(id);
      if (restaurant) {
        setFormData({
          name: restaurant.name,
          location: restaurant.location || '',
          contact_details: restaurant.contact_details || '',
          business_info: restaurant.business_info || '',
          restaurant_type: restaurant.restaurant_type || 'both',
          description: restaurant.description || '',
          phone: restaurant.phone || '',
          address: restaurant.address || '',
        });
        setCuisineTypes(restaurant.cuisine_types || []);
        setImages(restaurant.images || []);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load restaurant',
        variant: 'destructive',
      });
    }
  };

  const addCuisine = () => {
    if (cuisineInput.trim() && !cuisineTypes.includes(cuisineInput.trim())) {
      setCuisineTypes([...cuisineTypes, cuisineInput.trim()]);
      setCuisineInput('');
    }
  };

  const removeCuisine = (cuisine: string) => {
    setCuisineTypes(cuisineTypes.filter(c => c !== cuisine));
  };

  const addImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (image: string) => {
    setImages(images.filter(img => img !== image));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Restaurant name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!profile) return;

    setLoading(true);
    try {
      const restaurantData = {
        ...formData,
        cuisine_types: cuisineTypes.length > 0 ? cuisineTypes : null,
        images: images.length > 0 ? images : null,
      };

      if (id) {
        await restaurantApi.updateRestaurant(id, restaurantData);
        toast({
          title: 'Success',
          description: 'Restaurant updated successfully',
        });
        // Refresh restaurant context after update
        await refreshRestaurant();
      } else {
        await restaurantApi.createRestaurant({
          ...restaurantData,
          owner_id: profile.id,
          restaurant_type: formData.restaurant_type,
          average_rating: 0,
          opening_hours: null,
        });
        toast({
          title: 'Success',
          description: 'Restaurant created successfully',
        });
        // Refresh restaurant context after creation
        await refreshRestaurant();
      }
      navigate('/owner/restaurants');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save restaurant',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout title={id ? 'Edit Restaurant' : 'Create New Restaurant'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit Restaurant' : 'Create New Restaurant'}</CardTitle>
            <CardDescription>
              {id ? 'Update your restaurant information' : 'Add your restaurant details to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restaurant_type">Restaurant Type *</Label>
                  <Select
                    value={formData.restaurant_type}
                    onValueChange={(value: RestaurantType) => setFormData({ ...formData, restaurant_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select restaurant type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">🥗 Vegetarian Only</SelectItem>
                      <SelectItem value="non_veg">🍖 Non-Vegetarian</SelectItem>
                      <SelectItem value="both">🍽️ Both Veg & Non-Veg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your restaurant, ambiance, specialties..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Additional Contact</Label>
                    <Input
                      id="contact"
                      value={formData.contact_details}
                      onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                      placeholder="Email, WhatsApp, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, city, state, zip code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (Short)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Downtown, Main Street"
                  />
                </div>
              </div>

              {/* Cuisine Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cuisine Types</h3>
                <div className="flex gap-2">
                  <Input
                    value={cuisineInput}
                    onChange={(e) => setCuisineInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCuisine())}
                    placeholder="e.g., Italian, Chinese, Indian"
                  />
                  <Button type="button" onClick={addCuisine} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {cuisineTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cuisineTypes.map((cuisine) => (
                      <Badge key={cuisine} variant="secondary" className="gap-1">
                        {cuisine}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeCuisine(cuisine)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Restaurant Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Restaurant Images</h3>
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    placeholder="Enter image URL"
                  />
                  <Button type="button" onClick={addImage} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Restaurant ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="business_info">Additional Details</Label>
                  <Textarea
                    id="business_info"
                    value={formData.business_info}
                    onChange={(e) => setFormData({ ...formData, business_info: e.target.value })}
                    placeholder="Operating hours, seating capacity, parking info..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : id ? 'Update Restaurant' : 'Create Restaurant'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/owner/restaurants')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
}
