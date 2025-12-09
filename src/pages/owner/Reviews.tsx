import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ThumbsUp, Reply } from 'lucide-react';
import { reviewApi } from '@/db/api';
import type { ReviewWithCustomer } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function Reviews() {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadReviews();
    }
  }, [restaurantId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewApi.getReviewsByRestaurant(restaurantId!);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <OwnerLayout title="Customer Reviews">
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title="Customer Reviews">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text-primary mb-2">Customer Reviews</h1>
          <p className="text-muted-foreground">Manage and respond to customer feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
                  <p className="text-3xl font-bold gradient-text-primary">{averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold gradient-text-secondary">{reviews.length}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">5 Star Reviews</p>
                  <p className="text-3xl font-bold text-green-500">{reviews.filter(r => r.rating === 5).length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Replies</p>
                  <p className="text-3xl font-bold gradient-text-electric">{reviews.filter(r => !r.reply).length}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Reply className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card className="glass border-2 border-border">
          <CardHeader>
            <CardTitle>All Reviews</CardTitle>
            <CardDescription>View and respond to customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 rounded-lg border border-border hover:border-primary/50 transition-all bg-muted/30"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {review.customer?.full_name?.[0] || review.customer?.username?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="font-semibold">{review.customer?.full_name || review.customer?.username || 'Anonymous'}</h4>
                          <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant={review.reply ? 'default' : 'secondary'}>
                          {review.reply ? 'Replied' : 'Pending'}
                        </Badge>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-muted-foreground mb-4">{review.comment}</p>
                    )}

                    {review.reply && (
                      <div className="ml-6 pl-4 border-l-2 border-primary/50 bg-primary/5 p-4 rounded-r-lg mb-4">
                        <p className="text-sm font-medium mb-1">Your Reply:</p>
                        <p className="text-sm text-muted-foreground">{review.reply}</p>
                      </div>
                    )}

                    {!review.reply && (
                      <Button variant="outline" size="sm" className="morph-button">
                        <Reply className="w-4 h-4 mr-2" />
                        Reply to Review
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
}
