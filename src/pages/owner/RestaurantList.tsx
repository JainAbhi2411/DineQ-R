import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { restaurantApi } from '@/db/api';
import { Restaurant } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Store, MapPin, Phone, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OwnerLayout from '@/components/owner/OwnerLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function RestaurantList() {
  const { profile } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRestaurants();
  }, [profile]);

  const loadRestaurants = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const data = await restaurantApi.getRestaurantsByOwner(profile.id);
      setRestaurants(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load restaurants',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await restaurantApi.deleteRestaurant(id);
      toast({
        title: 'Success',
        description: 'Restaurant deleted successfully',
      });
      loadRestaurants();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete restaurant',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <OwnerLayout title="My Restaurants">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title="My Restaurants">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-muted-foreground">Manage your restaurant profiles</p>
          </div>
          <Button asChild className="morph-button hover-glow-orange">
            <Link to="/owner/restaurants/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Link>
          </Button>
        </div>

        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Store className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Restaurants Yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Create your first restaurant profile to start managing your menu and orders
              </p>
              <Button asChild>
                <Link to="/owner/restaurants/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Restaurant
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    {restaurant.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {restaurant.business_info || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {restaurant.location && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{restaurant.location}</span>
                    </div>
                  )}
                  {restaurant.contact_details && (
                    <div className="flex items-start gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{restaurant.contact_details}</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/owner/menu/${restaurant.id}`}>
                        Manage Menu
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/owner/restaurants/${restaurant.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Restaurant?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {restaurant.name} and all associated data including menu items, tables, and orders. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(restaurant.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
