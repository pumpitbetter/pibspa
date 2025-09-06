import { useState } from "react";
import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { LinkBack } from "~/components/link-back";
import { dbPromise } from "~/db/db";
import { ExerciseSelectionList } from "./exercise-selection-list";
import { ExerciseSearchAndFilter } from "./exercise-search-and-filter";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Plus } from "lucide-react";
import { Form, Link, redirect } from "react-router";
import type { ExercisesDocType } from "~/db/exercises";
import type { RoutinesDocType } from "~/db/routines";
import type { ProgramsDocType } from "~/db/programs";
import invariant from "tiny-invariant";

interface LoaderData {
  exercises: ExercisesDocType[];
  routine: RoutinesDocType | null;
  program: ProgramsDocType | null;
}

interface ClientLoaderArgs {
  params: { routineId: string };
}

interface ClientActionArgs {
  request: Request;
  params: { routineId: string };
}

export async function clientLoader({
  params,
}: ClientLoaderArgs): Promise<LoaderData> {
  const db = await dbPromise;
  invariant(db, "Database should be available in app routes");
  const exercises = await db.exercises.find().exec();
  const routine = await db.routines.findOne(params.routineId).exec();

  let program = null;
  if (routine) {
    program = await db.programs.findOne(routine.programId).exec();
  }

  return {
    exercises: exercises.map((e) => e.toMutableJSON()),
    routine: routine?.toMutableJSON() || null,
    program: program?.toMutableJSON() || null,
  };
}

export async function clientAction({ request, params }: ClientActionArgs) {
  const formData = await request.formData();
  const selectedExerciseIds = formData.getAll("selectedExercises") as string[];

  if (selectedExerciseIds.length === 0) {
    return { error: "Please select at least one exercise" };
  }

  const db = await dbPromise;
  invariant(db, "Database should be available in app routes");

  // Get the routine to extract the program ID
  const routine = await db.routines.findOne(params.routineId).exec();
  if (!routine) {
    return { error: "Routine not found" };
  }

  // Get the highest order number for the routine
  const existingTemplates = await db.templates
    .find({ selector: { routineId: params.routineId } })
    .exec();

  const maxOrder = existingTemplates.reduce(
    (max, template) => Math.max(max, template.order),
    0
  );

  // Create templates for each selected exercise
  const newTemplates = selectedExerciseIds.map((exerciseId, index) => ({
    id: crypto.randomUUID(),
    programId: routine.programId, // Use the actual program ID from the routine
    routineId: params.routineId,
    exerciseId,
    order: maxOrder + index + 1,
    sequence: 1, // Single exercise, not a circuit
    load: 1.0,
    reps: 5, // Default reps
    progression: {
      increment: [
        {
          value: 5,
          kind: "weight" as const,
          type: "absolute" as const,
          frequency: 1,
        },
      ],
      decrement: [
        {
          value: 0.1,
          kind: "weight" as const,
          type: "percentage" as const,
          frequency: 3,
        },
      ],
    },
  }));

  await db.templates.bulkInsert(newTemplates);

  // Redirect back to the routine page after successful insertion
  return redirect(`/app/program/${params.routineId}`);
}

export default function AddExercisesRoute({
  loaderData,
}: {
  loaderData: LoaderData;
}) {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const { exercises, routine, program } = loaderData;

  const filteredExercises = exercises.filter((exercise: ExercisesDocType) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesEquipment =
      equipmentFilter.length === 0 ||
      equipmentFilter.some((eq) => exercise.equipment.includes(eq as any));
    const matchesType =
      typeFilter.length === 0 || typeFilter.includes(exercise.type);

    return matchesSearch && matchesEquipment && matchesType;
  });

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedExercises(filteredExercises.map((e: ExercisesDocType) => e.id));
  };

  const handleClearSelection = () => {
    setSelectedExercises([]);
  };

  return (
    <Page>
      <Header
        title="Add Exercises"
        left={<LinkBack to={`/app/program/${routine?.id}`} />}
        right={
          <Link to={`/app/program/${routine?.id}/add-exercises/new`}>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </Link>
        }
      />

      <MainContent>
        <div className="space-y-4 p-4">
          <ExerciseSearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            equipmentFilter={equipmentFilter}
            onEquipmentFilterChange={setEquipmentFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            exercises={exercises}
          />

          <ExerciseSelectionList
            exercises={filteredExercises}
            selectedExercises={selectedExercises}
            onExerciseToggle={handleExerciseToggle}
          />
        </div>
      </MainContent>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedExercises.length} selected
            </Badge>
            {selectedExercises.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                Clear
              </Button>
            )}
          </div>
        </div>

        <Form method="post" className="flex gap-2">
          {selectedExercises.map((id) => (
            <input key={id} type="hidden" name="selectedExercises" value={id} />
          ))}
          <Link to={`/app/program/${routine?.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1"
            disabled={selectedExercises.length === 0}
          >
            Add Selected
          </Button>
        </Form>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed bottom bar */}
      <div className="h-32" />
    </Page>
  );
}
