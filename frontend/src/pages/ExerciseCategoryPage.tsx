import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Dumbbell } from 'lucide-react';
import { useExercisesByCategory } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

interface ExerciseCategoryPageProps {
  category: string;
}

export default function ExerciseCategoryPage({ category }: ExerciseCategoryPageProps) {
  const { data: exercises, isLoading } = useExercisesByCategory(category);

  // Default exercises if backend returns empty
  const defaultExercises = {
    'Upper Body': [
      { name: 'Push-ups', description: 'Classic chest and arm exercise', instructions: 'Start in plank position, lower body until chest nearly touches floor, push back up. Keep core tight.' },
      { name: 'Pull-ups', description: 'Back and bicep builder', instructions: 'Hang from bar with overhand grip, pull yourself up until chin clears bar, lower with control.' },
      { name: 'Dumbbell Rows', description: 'Strengthen your back', instructions: 'Bend at hips with dumbbell in one hand, pull weight to hip, squeeze shoulder blade, lower slowly.' },
      { name: 'Shoulder Press', description: 'Build strong shoulders', instructions: 'Press dumbbells overhead from shoulder height, fully extend arms, lower with control.' },
      { name: 'Bicep Curls', description: 'Isolate and grow biceps', instructions: 'Hold dumbbells at sides, curl weights up to shoulders, squeeze biceps, lower slowly.' },
    ],
    'Lower Body': [
      { name: 'Squats', description: 'King of leg exercises', instructions: 'Stand with feet shoulder-width, lower hips back and down, keep chest up, drive through heels to stand.' },
      { name: 'Lunges', description: 'Build leg strength and balance', instructions: 'Step forward, lower back knee toward ground, keep front knee over ankle, push back to start.' },
      { name: 'Deadlifts', description: 'Full posterior chain workout', instructions: 'Hinge at hips, grip bar, keep back straight, drive through heels to stand, squeeze glutes at top.' },
      { name: 'Leg Press', description: 'Powerful quad builder', instructions: 'Sit in machine, feet on platform, push weight up by extending legs, lower with control.' },
      { name: 'Calf Raises', description: 'Strengthen your calves', instructions: 'Stand on edge of step, raise up on toes as high as possible, lower heels below step level.' },
    ],
    'Core': [
      { name: 'Planks', description: 'Ultimate core stabilizer', instructions: 'Hold push-up position on forearms, keep body straight from head to heels, engage core, hold.' },
      { name: 'Crunches', description: 'Target upper abs', instructions: 'Lie on back, knees bent, hands behind head, lift shoulders off ground, squeeze abs, lower slowly.' },
      { name: 'Russian Twists', description: 'Oblique strengthener', instructions: 'Sit with knees bent, lean back slightly, rotate torso side to side, touch ground beside hips.' },
      { name: 'Leg Raises', description: 'Lower ab focus', instructions: 'Lie on back, legs straight, raise legs to 90 degrees, lower slowly without touching ground.' },
      { name: 'Mountain Climbers', description: 'Dynamic core workout', instructions: 'Start in plank, drive knees to chest alternately in running motion, keep core tight.' },
    ],
    'Cardio': [
      { name: 'Running', description: 'Classic cardio exercise', instructions: 'Maintain steady pace, land midfoot, keep shoulders relaxed, breathe rhythmically.' },
      { name: 'Jump Rope', description: 'High-intensity cardio', instructions: 'Jump with both feet, rotate rope with wrists, land softly on balls of feet, maintain rhythm.' },
      { name: 'Burpees', description: 'Full body cardio blast', instructions: 'Drop to plank, do push-up, jump feet to hands, explode up with jump, repeat quickly.' },
      { name: 'High Knees', description: 'Cardio and leg power', instructions: 'Run in place, drive knees up to hip height, pump arms, maintain fast pace.' },
      { name: 'Jumping Jacks', description: 'Warm-up and cardio', instructions: 'Jump feet out while raising arms overhead, jump back to start, maintain steady rhythm.' },
    ],
  };

  const displayExercises = exercises && exercises.length > 0 
    ? exercises 
    : defaultExercises[category as keyof typeof defaultExercises] || [];

  if (isLoading) {
    return (
      <div className="container py-8 px-4 max-w-6xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-6xl">
      {/* Hidden compliment */}
      <div className="hidden-compliment top-24 left-12">you inspire me</div>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-foreground">
            <Zap className="h-10 w-10 text-primary" />
            {category} Exercises
          </h1>
          <p className="text-muted-foreground">
            Curated exercises to help you build strength and achieve your fitness goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayExercises.map((exercise, index) => (
            <Card key={index} className="hover:shadow-lg transition-all border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  {exercise.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground font-medium">
                  {exercise.description}
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold mb-1 text-foreground">How to perform:</p>
                  <p className="text-sm text-muted-foreground">
                    {(exercise as any).instructions || 'Follow proper form and technique for best results.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
