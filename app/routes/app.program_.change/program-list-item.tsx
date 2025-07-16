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

export function ProgramListItem({
  id,
  title,
  description,
  type,
  level,
  onClick,
}: {
  id: string;
  title: string;
  description: string;
  type: string;
  level: string;
  onClick?: () => void;
}) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const cloneFetcher = useFetcher();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetcher.submit(event.currentTarget);
    navigate("/app/program");
  };

  const handleClone = () => {
    cloneFetcher.submit(
      { programId: id, intent: "clone" },
      { method: "post" }
    );
  };

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
                <DropdownMenuItem onSelect={handleClone}>Clone</DropdownMenuItem>
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
    </li>
  );
}
