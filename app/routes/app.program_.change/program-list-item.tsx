import { useFetcher, useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DialogDeleteProgram } from "./dialog-delete-program";
import { useEffect, useState } from "react";

export function ProgramListItem({
  id,
  title,
  description,
  type,
  level,
  ownerId,
  onClick,
}: {
  id: string;
  title: string;
  description: string;
  type: string;
  level: string;
  ownerId: string;
  onClick?: () => void;
}) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const cloneFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetcher.submit(event.currentTarget);
    navigate("/app/program");
  };

  const handleClone = () => {
    cloneFetcher.submit({ programId: id, intent: "clone" }, { method: "post" });
  };

  const handleDelete = () => {
    // Use setTimeout to ensure the dialog opens after the click event completes
    setTimeout(() => {
      setIsDeleteDialogOpen(true);
    }, 0);
  };

  const handleConfirmDelete = () => {
    deleteFetcher.submit(
      { programId: id, intent: "delete" },
      { method: "post" }
    );
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (deleteFetcher.state === "idle" && deleteFetcher.data) {
      if (deleteFetcher.data.ok) {
        // Program deleted successfully, revalidate the loader data
        fetcher.load("/app/program/change");
      } else {
        // Handle error, e.g., display a toast notification
        console.error("Failed to delete program:", deleteFetcher.data.error);
        alert("Failed to delete program: " + deleteFetcher.data.error); // Basic error display
      }
    }
  }, [deleteFetcher.state, deleteFetcher.data, fetcher]);

  return (
    <li className="w-full p-4" onClick={onClick}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-3">
                {[level, type].map((item) => (
                  <Badge variant="outline" key={item}>
                    {item}
                  </Badge>
                ))}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mt-2 -mr-4">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleClone}>
                  Clone
                </DropdownMenuItem>
                {ownerId !== "system" && (
                  <DropdownMenuItem onSelect={handleDelete}>
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>{description}</CardContent>
        <CardFooter className="flex justify-end">
          <fetcher.Form method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="programId" value={id} />
            <Button type="submit">Select</Button>
          </fetcher.Form>
        </CardFooter>
      </Card>
      <DialogDeleteProgram
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </li>
  );
}
