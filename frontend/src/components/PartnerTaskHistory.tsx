import { CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { useTasksByProfile } from '@/hooks/useQueries';

interface PartnerTaskHistoryProps {
  profileId: string;
}

export default function PartnerTaskHistory({ profileId }: PartnerTaskHistoryProps) {
  const { data: tasks, isLoading, error } = useTasksByProfile(profileId);

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Daily Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('[PartnerTaskHistory] Error loading tasks:', error);
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Daily Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center py-8">
            Error loading tasks. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Daily Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No tasks available yet. Check back later! 📋
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = tasks.filter((task) => task?.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Daily Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalTasks} completed
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            {completionPercentage.toFixed(0)}% Complete
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
          <div className="space-y-2">
            {tasks.map((task) => {
              if (!task) return null;
              
              return (
                <div
                  key={Number(task.id || 0)}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.description || 'Unnamed task'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {task.category || 'General'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
