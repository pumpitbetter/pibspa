import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useFetcher, useNavigate } from "react-router";

export function DialogAlertDelete({
  workoutId,
  setActiveItemId,
  children,
}: {
  workoutId: string;
  setActiveItemId: (value: string | null) => void;
  children: React.ReactNode;
}) {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workout?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            workout.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="flex justify-end gap-4 pt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setActiveItemId(null);
                await fetcher.submit(
                  {
                    intent: "deleteWorkout",
                    workoutId,
                  },
                  { method: "post" }
                );
                navigate("/app/queue");
              }}
            >
              Continue
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
