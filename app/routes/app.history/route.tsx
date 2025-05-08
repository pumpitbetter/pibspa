import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { Calendar } from "~/components/ui/calendar";
import { useNavigate } from "react-router";
import type { Route } from "./+types/route";
import { dbPromise } from "~/db/db";
import type { Modifiers } from "react-day-picker";

// https://date-picker.luca-felix.com/

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const minDate = new Date(year, month, 1);
  const maxDate = new Date(year, month + 1, 0);

  const db = await dbPromise;

  const workouts = await db.workouts
    .find({
      selector: {
        startedAt: {
          $gte: minDate.valueOf(),
          $lt: maxDate.valueOf(),
        },
      },
    })
    .exec();

  return {
    workouts: workouts.map((w) => w.toMutableJSON()),
  };
}

export default function History({ loaderData }: Route.ComponentProps) {
  const { workouts } = loaderData;
  const navigate = useNavigate();

  const workoutDates = workouts.map((workout) => new Date(workout.startedAt));

  const handleOnMonthChange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
    const day = date.getDate();
    const searchParams = new URLSearchParams({
      date: `${year}-${month}-${day}`,
    });
    navigate(".?" + searchParams.toString(), { replace: true });
  };

  const handleOnDayClick = (date: Date, modifiers: Modifiers) => {
    if (modifiers.workout) {
      const workout = workouts.find((w) => {
        const workoutDate = new Date(w.startedAt);
        return (
          workoutDate.getFullYear() === date.getFullYear() &&
          workoutDate.getMonth() === date.getMonth() &&
          workoutDate.getDate() === date.getDate()
        );
      });
      if (workout) {
        const searchParams = new URLSearchParams({
          back: location.pathname,
        });
        navigate(`/app/workouts/${workout.id}?${searchParams.toString()}`, {
          replace: true,
        });
      }
    }
  };

  return (
    <Page>
      <Header title="History" />
      <MainContent>
        <div className="flex items-center justify-center">
          <Calendar
            mode="single"
            className="p-0"
            weekdayClassName="w-11"
            dayClassName="size-11"
            modifiers={{
              workout: workoutDates,
            }}
            modifiersClassNames={{
              selected: `bg-none`,
              today: `bg-none border-1 border-tertiary/15 text-on-container rounded-full`, // Highlight the selected day
              workout: `bg-tertiary text-on-tertiary rounded-full`,
            }}
            onMonthChange={handleOnMonthChange}
            onDayClick={handleOnDayClick}
          />
        </div>
      </MainContent>
    </Page>
  );
}
