import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useDailyTasks, useCompleteTask } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import TaskCompletionAnimation from '@/components/TaskCompletionAnimation';
import RewardSelector from '@/components/RewardSelector';

export default function TasksPage() {
  const { data: tasks, isLoading } = useDailyTasks();
  const completeTask = useCompleteTask();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showRewardSelector, setShowRewardSelector] = useState(false);

  const completedCount = tasks?.filter((task) => task.completed).length || 0;
  const totalCount = tasks?.length || 0;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  useEffect(() => {
    if (allCompleted && !showAnimation && !showRewardSelector) {
      setShowAnimation(true);
    }
  }, [allCompleted, showAnimation, showRewardSelector]);

  const handleTaskToggle = (taskId: bigint, currentStatus: boolean) => {
    if (!currentStatus) {
      completeTask.mutate(taskId);
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
      <div className="container py-8 space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Daily Tasks</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Complete your daily fitness challenges and earn rewards
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Progress</span>
            <span className="text-sm font-normal text-muted-foreground">
              {completedCount} of {totalCount} completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Progress value={completionPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {completionPercentage.toFixed(0)}% Complete
            </p>
          </div>

          <div className="space-y-4">
            {tasks?.map((task) => (
              <div
                key={Number(task.id)}
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleTaskToggle(task.id, task.completed)}
                  disabled={task.completed}
                  className="h-6 w-6"
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.description}
                      </p>
                      <p className="text-sm text-muted-foreground">{task.category}</p>
                    </div>
                    {task.completed && (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAnimation && <TaskCompletionAnimation onComplete={handleAnimationComplete} />}
      {showRewardSelector && <RewardSelector onRewardSelected={handleRewardSelected} />}
    </div>
  );
}
