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
import { useRestTime } from "~/lib/hooks";

export function DialogAlertFinish({
  workoutId,
  setActiveItemId,
  children,
}: {
  workoutId: string;
  setActiveItemId: (value: string | null) => void;
  children: React.ReactNode;
}) {
  const { stopRest } = useRestTime();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finish workout?</AlertDialogTitle>
          <AlertDialogDescription>
            You haven't logged all sets. Are you sure you want to finish this
            workout?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="flex justify-end gap-4 pt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setActiveItemId(null);
                stopRest();
                await fetcher.submit(
                  {
                    intent: "finishWorkout",
                    workoutId,
                  },
                  { method: "post" }
                );
                navigate("/app/queue");
              }}
            >
              Finish
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
