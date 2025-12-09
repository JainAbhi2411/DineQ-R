import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { visitedRestaurantApi } from '@/db/api';
import { VisitedRestaurantWithDetails, RestaurantType } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Store, Search, X, MapPin, Star, Clock, ChevronRight, Leaf, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { cn } from '@/lib/utils';

export default function BrowseRestaurants() {
  const getRestaurantTypeBadge = (type: RestaurantType) => {
    switch (type) {
      case 'veg':
        return (
          <Badge variant="outline" className="border-green-600 text-green-600 text-xs">
            <Leaf className="w-3 h-3 mr-1" /> Pure Veg
          </Badge>
        );
      case 'non_veg':
        return (
          <Badge variant="outline" className="border-red-600 text-red-600 text-xs">
            <Flame className="w-3 h-3 mr-1" /> Non-Veg
          </Badge>
        );
      case 'both':
        return (
          <Badge variant="outline" className="border-orange-600 text-orange-600 text-xs">
            <div className="flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              <Flame className="w-3 h-3" />
            </div>
            <span className="ml-1">Veg & Non-Veg</span>
          </Badge>
        );
      default:
        return null;
    }
  };
  const { profile } = useAuth();
  const [restaurants, setRestaurants] = useState<VisitedRestaurantWithDetails[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<VisitedRestaurantWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { formatDateTime } = useFormatters();
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
  }, [profile]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = restaurants.filter(r => 
        r.restaurant?.name?.toLowerCase().includes(query) ||
        r.restaurant?.location?.toLowerCase().includes(query) ||
        r.restaurant?.contact_details?.toLowerCase().includes(query)
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  const loadRestaurants = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const data = await visitedRestaurantApi.getVisitedRestaurants(profile.id);
      setRestaurants(data);
      setFilteredRestaurants(data);
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

  const handleRemoveRestaurant = async (visitedRestaurantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!profile) return;

    try {
      await visitedRestaurantApi.deleteVisitedRestaurant(visitedRestaurantId);
      toast({
        title: 'Success',
        description: 'Restaurant removed from your list',
      });
      loadRestaurants();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove restaurant',
        variant: 'destructive',
      });
    }
  };

  const handleViewMenu = (restaurantId: string) => {
    navigate(`/customer/menu/${restaurantId}`);
  };

  if (loading) {
    return (
      <CustomerLayout title="Browse Restaurants">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Browse Restaurants">
      <div className="px-3 xl:px-6 py-4 xl:py-6">
        {/* Search Bar */}
        <div className="mb-6 animate-fade-in-up">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search restaurants by name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base border-2 focus:border-primary"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {filteredRestaurants.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Store className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Restaurants Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start exploring by scanning a restaurant QR code'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/customer/scan')} size="lg">
                Scan QR Code
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
            {filteredRestaurants.map((visited, index) => (
              <Card
                key={visited.id}
                className="group cursor-pointer overflow-hidden border-2 hover:border-primary hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleViewMenu(visited.restaurant_id)}
              >
                {/* Restaurant Image */}
                <div className="relative h-40 xl:h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                  {visited.restaurant?.images?.[0] ? (
                    <img
                      src={visited.restaurant.images[0]}
                      alt={visited.restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleRemoveRestaurant(visited.id, e)}
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {/* Visit Count Badge */}
                  <Badge className="absolute bottom-2 left-2 bg-background/90 text-foreground border">
                    Visited {visited.visit_count}x
                  </Badge>
                </div>

                <CardContent className="p-4">
                  {/* Restaurant Name & Type */}
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-bold text-lg xl:text-xl line-clamp-1 group-hover:text-primary transition-colors flex-1">
                      {visited.restaurant?.name || 'Unknown Restaurant'}
                    </h3>
                    {visited.restaurant?.restaurant_type && getRestaurantTypeBadge(visited.restaurant.restaurant_type)}
                  </div>

                  {/* Cuisine Types */}
                  {visited.restaurant?.cuisine_types && visited.restaurant.cuisine_types.length > 0 && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {visited.restaurant.cuisine_types.join(', ')}
                    </p>
                  )}

                  {/* Rating & Delivery Time */}
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-semibold">{visited.restaurant?.average_rating?.toFixed(1) || '4.0'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>25-30 mins</span>
                    </div>
                  </div>

                  {/* Location */}
                  {visited.restaurant?.location && (
                    <div className="flex items-start gap-2 text-xs xl:text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{visited.restaurant.location}</span>
                    </div>
                  )}

                  {/* Last Visited */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Last visited {formatDateTime(visited.last_visited_at)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
