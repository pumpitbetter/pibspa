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

export function DialogAlertFinish({
  workoutId,
  children,
}: {
  workoutId: string;
  children: React.ReactNode;
}) {
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
