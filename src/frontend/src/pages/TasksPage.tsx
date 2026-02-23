import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Trophy, Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useDailyTasks, useSetTaskCompleted } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import TaskCompletionAnimation from '@/components/TaskCompletionAnimation';
import RewardSelector from '@/components/RewardSelector';
import { toast } from 'sonner';

export default function TasksPage() {
  const { data: tasks, isLoading } = useDailyTasks();
  const setTaskCompleted = useSetTaskCompleted();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showRewardSelector, setShowRewardSelector] = useState(false);
  const [previouslyCompleted, setPreviouslyCompleted] = useState(false);

  const allTasksCompleted = tasks?.every((task) => task.completed) ?? false;
  const completedCount = tasks?.filter((task) => task.completed).length ?? 0;
  const totalCount = tasks?.length ?? 0;

  useEffect(() => {
    if (allTasksCompleted && !previouslyCompleted && tasks && tasks.length > 0) {
      setShowAnimation(true);
      setPreviouslyCompleted(true);
    } else if (!allTasksCompleted) {
      setPreviouslyCompleted(false);
    }
  }, [allTasksCompleted, previouslyCompleted, tasks]);

  const handleTaskToggle = async (taskId: bigint, currentStatus: boolean) => {
    if (currentStatus) return; // Don't allow unchecking
    
    try {
      await setTaskCompleted.mutateAsync(taskId);
      toast.success('Task completed! 💪');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowRewardSelector(true);
  };

  const handleRewardSelected = () => {
    setShowRewardSelector(false);
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4 max-w-4xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-4xl">
      {/* Hidden compliment */}
      <div className="hidden-compliment top-24 right-8">keep going strong</div>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Daily Tasks</h1>
          <p className="text-muted-foreground">
            Complete your daily fitness challenges and earn rewards
          </p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Today's Progress
              </span>
              <span className="text-2xl font-bold text-primary">
                {completedCount}/{totalCount}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Today's Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks?.map((task) => (
                <div
                  key={Number(task.id)}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-all"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id, task.completed)}
                    disabled={task.completed}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.category}
                    </p>
                  </div>
                  {task.completed && (
                    <Sparkles className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-secondary/5 border-accent/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Monthly Challenge</h3>
            <p className="text-sm text-muted-foreground">
              Complete all daily tasks consistently throughout the month for a chance to earn a special big reward! 
              Keep up the great work! 💪
            </p>
          </CardContent>
        </Card>
      </div>

      {showAnimation && <TaskCompletionAnimation onComplete={handleAnimationComplete} />}
      {showRewardSelector && <RewardSelector onRewardSelected={handleRewardSelected} />}
    </div>
  );
}
