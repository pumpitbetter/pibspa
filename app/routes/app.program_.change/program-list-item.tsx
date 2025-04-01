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
  title,
  description,
  type,
  level,
  onClick,
}: {
  title: string;
  description: string;
  type: string;
  level: string;
  onClick?: () => void;
}) {
  return (
    <li className="w-full p-4" onClick={onClick}>
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
          <Button>Select</Button>
        </CardFooter>
      </Card>
    </li>
  );
}
