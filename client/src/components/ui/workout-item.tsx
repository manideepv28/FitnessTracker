import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { getWorkoutIcon, getWorkoutTypeLabel, formatWorkoutDate } from '@/lib/workout-utils';
import type { Workout } from '@shared/schema';

interface WorkoutItemProps {
  workout: Workout;
  onEdit?: (workout: Workout) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function WorkoutItem({ workout, onEdit, onDelete, showActions = true }: WorkoutItemProps) {
  const iconClass = getWorkoutIcon(workout.type);
  const typeLabel = getWorkoutTypeLabel(workout.type);
  const formattedDate = formatWorkoutDate(workout.date, workout.time);

  const getColorClass = (type: string) => {
    const colors: Record<string, string> = {
      running: 'bg-blue-100 text-blue-600',
      cycling: 'bg-orange-100 text-orange-600', 
      strength: 'bg-green-100 text-green-600',
      swimming: 'bg-cyan-100 text-cyan-600',
      yoga: 'bg-purple-100 text-purple-600',
      cardio: 'bg-red-100 text-red-600',
      other: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(workout.type)}`}>
            <i className={iconClass}></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{workout.name}</h4>
            <p className="text-sm text-gray-600">{typeLabel} • {formattedDate}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>
                <i className="fas fa-clock mr-1"></i>
                {workout.duration} min
              </span>
              {workout.distance && (
                <span>
                  <i className="fas fa-route mr-1"></i>
                  {workout.distance} miles
                </span>
              )}
              {workout.calories && (
                <span>
                  <i className="fas fa-fire mr-1"></i>
                  {workout.calories} cal
                </span>
              )}
            </div>
          </div>
        </div>
        {showActions && (onEdit || onDelete) && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(workout)}
                className="text-gray-400 hover:text-primary"
              >
                <i className="fas fa-edit"></i>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(workout.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <i className="fas fa-trash"></i>
              </Button>
            )}
          </div>
        )}
      </div>
      {workout.notes && (
        <div className="mt-3 pl-16">
          <p className="text-sm text-gray-600 italic">{workout.notes}</p>
        </div>
      )}
    </div>
  );
}
