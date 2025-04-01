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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetcher.submit(event.currentTarget);
    navigate("/app/program");
  };

  return (
    <li className="w-full p-4" onClick={onClick}>
      <fetcher.Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="programId" value={id} />
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-3">
              {[level, type].map((item) => (
                <Badge variant="outline">{item}</Badge>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent>{description}</CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Select</Button>
          </CardFooter>
        </Card>
      </fetcher.Form>
    </li>
  );
}
