import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { weeklyTasksApi } from '@/db/api';
import type { WeeklyTaskWithProgress } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Trophy,
  Award,
  Star,
  ShoppingBag,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/db/supabase';

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Award,
  Star,
  ShoppingBag,
  Calendar,
  MapPin,
  DollarSign,
  Sparkles,
};

const difficultyColors = {
  easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function WeeklyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<WeeklyTaskWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadTasks();

      // Set up real-time subscription for task progress updates
      const channel = supabase
        .channel('user_task_progress_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_task_progress',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('[WeeklyTasks] Real-time update:', payload);
            // Reload tasks when progress changes
            loadTasks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  const loadTasks = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await weeklyTasksApi.getUserWeeklyTasks(user.id);
      setTasks(data);

      if (data.length > 0 && data[0].week_start_date && data[0].week_end_date) {
        const startDate = new Date(data[0].week_start_date);
        const endDate = new Date(data[0].week_end_date);
        
        // Validate dates before setting
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          setWeekDates({
            start: startDate,
            end: endDate,
          });
        }
      }
    } catch (error) {
      console.error('Error loading weekly tasks:', error);
      toast.error('Failed to load weekly tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTaskIcon = (iconName: string | null) => {
    if (!iconName) return ShoppingBag;
    return iconMap[iconName] || ShoppingBag;
  };

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const totalPoints = tasks.reduce((sum, t) => (t.is_completed ? sum + t.points_reward : sum), 0);
  const potentialPoints = tasks.reduce((sum, t) => sum + t.points_reward, 0);

  if (loading) {
    return (
      <div className="container mx-auto p-4 xl:p-6 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64 bg-muted" />
          <div className="grid gap-4 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 bg-muted" />
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 xl:p-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl xl:text-4xl font-bold mb-2">Weekly Challenges</h1>
          <p className="text-muted-foreground">
            Complete tasks to earn bonus points and rewards
            {weekDates && (
              <span className="ml-2">
                • {format(weekDates.start, 'MMM d')} - {format(weekDates.end, 'MMM d, yyyy')}
              </span>
            )}
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {completedCount} / {tasks.length}
              </div>
              <Progress
                value={(completedCount / tasks.length) * 100}
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Points Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalPoints}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {potentialPoints - totalPoints} points remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Keep going to earn all rewards!
              </p>
            </CardContent>
          </Card>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Tasks Available</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Check back soon for new weekly challenges and opportunities to earn bonus points!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Tasks</h2>
            <div className="grid gap-4 xl:grid-cols-2">
              {tasks.map((task) => {
                const Icon = getTaskIcon(task.icon);
                const isCompleted = task.is_completed;

                return (
                  <Card
                    key={task.id}
                    className={`relative overflow-hidden transition-all ${
                      isCompleted ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <Badge
                              variant="outline"
                              className={difficultyColors[task.difficulty]}
                            >
                              {task.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{task.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {task.current_value} / {task.target_value}
                          </span>
                        </div>
                        <Progress value={task.progress_percentage} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-primary">
                            {task.points_reward} points
                          </span>
                        </div>
                        {isCompleted && (
                          <Badge variant="default" className="bg-primary">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Complete Tasks</p>
                <p className="text-sm text-muted-foreground">
                  Place orders, write reviews, and explore restaurants to make progress
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Earn Bonus Points</p>
                <p className="text-sm text-muted-foreground">
                  Get rewarded with points when you complete each challenge
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Redeem Rewards</p>
                <p className="text-sm text-muted-foreground">
                  Use your points to get discounts on future orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
