import { useFetcher, useNavigate } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useEffect } from "react";

export function DialogSummary({
  workoutId,
  children,
}: {
  workoutId: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const handleCloseButtonClick = async () => {
    navigate("/app/queue");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        You have successfully completed the workout.
        <div className="flex justify-end gap-4 pt-4">
          {/* <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose> */}
          <DialogClose asChild>
            <Button onClick={handleCloseButtonClick}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
