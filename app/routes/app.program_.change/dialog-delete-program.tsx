import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export function DialogDeleteProgram({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            program and all of its associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="default" onClick={onConfirm}>
              Delete
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
