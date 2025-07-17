import { Form } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

interface DialogSetsEditProps {
  exerciseId: string;
  routineId: string;
  currentSetCount: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogSetsEdit({
  exerciseId,
  routineId,
  currentSetCount,
  isOpen,
  onOpenChange,
}: DialogSetsEditProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Sets</DialogTitle>
        </DialogHeader>
        <Form
          method="post"
          className="space-y-4"
          onSubmit={() => {
            // Close dialog after form submission
            onOpenChange(false);
          }}
        >
          <input type="hidden" name="intent" value="updateSets" />
          <input type="hidden" name="exerciseId" value={exerciseId} />
          <input type="hidden" name="routineId" value={routineId} />
          <div className="space-y-2">
            <Label htmlFor="setCount">Number of Sets</Label>
            <Input
              id="setCount"
              name="setCount"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              defaultValue={currentSetCount.toString()}
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Save</Button>
            </DialogClose>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
