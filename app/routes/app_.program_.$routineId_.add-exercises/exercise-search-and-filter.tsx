import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Search, Filter } from "lucide-react";
import type { ExercisesDocType } from "~/db/exercises";

interface ExerciseSearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  equipmentFilter: string[];
  onEquipmentFilterChange: (equipment: string[]) => void;
  typeFilter: string[];
  onTypeFilterChange: (types: string[]) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  exercises: ExercisesDocType[];
}

export function ExerciseSearchAndFilter({
  searchTerm,
  onSearchChange,
  equipmentFilter,
  onEquipmentFilterChange,
  typeFilter,
  onTypeFilterChange,
  onSelectAll,
  onClearSelection,
  exercises,
}: ExerciseSearchAndFilterProps) {
  // Derive unique equipment types from exercises data
  const equipmentTypes = Array.from(
    new Set(exercises.flatMap(exercise => exercise.equipment))
  ).sort();

  // Derive unique exercise types from exercises data
  const exerciseTypes = Array.from(
    new Set(exercises.map(exercise => exercise.type))
  ).sort();

  const handleEquipmentToggle = (equipment: string) => {
    onEquipmentFilterChange(
      equipmentFilter.includes(equipment)
        ? equipmentFilter.filter(e => e !== equipment)
        : [...equipmentFilter, equipment]
    );
  };

  const handleTypeToggle = (type: string) => {
    onTypeFilterChange(
      typeFilter.includes(type)
        ? typeFilter.filter(t => t !== type)
        : [...typeFilter, type]
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
        >
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
        >
          Clear All
        </Button>
      </div>

      {/* Equipment Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Equipment</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {equipmentTypes.map((equipment) => (
            <Badge
              key={equipment}
              variant={equipmentFilter.includes(equipment) ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => handleEquipmentToggle(equipment)}
            >
              {equipment}
            </Badge>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Type</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {exerciseTypes.map((type) => (
            <Badge
              key={type}
              variant={typeFilter.includes(type) ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => handleTypeToggle(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
