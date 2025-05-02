import { cn } from "~/lib/utils";
import { BarLeft } from "./bar-left";
import { BarRight } from "./bar-right";
import { Button } from "../button";
import { Link } from "react-router";

const plateInfo = [
  {
    weight: 1.125,
    height: "min-h-[50px]",
    width: "min-w-[12px]",
    color: "bg-gray-900",
  },
  {
    weight: 2.5,
    height: "min-h-[50px]",
    width: "min-w-[12px]",
    color: "bg-gray-600",
  },
  {
    weight: 5,
    height: "min-h-[50px]",
    width: "min-w-[12px]",
    color: "bg-gray-600",
  },
  {
    weight: 10,
    height: "min-h-[55px]",
    width: "min-w-[18px]",
    color: "bg-gray-500",
  },
  {
    weight: 25,
    height: "min-h-[60px]",
    width: "min-w-[18px]",
    color: "bg-green-700",
  },
  {
    weight: 35,
    height: "min-h-[65px]",
    width: "min-w-[18px]",
    color: "bg-yellow-700",
  },
  {
    weight: 45,
    height: "min-h-[70px]",
    width: "min-w-[20px]",
    color: "bg-blue-700",
  },
  {
    weight: 55,
    height: "min-h-[70px]",
    width: "min-w-[20px]",
    color: "bg-red-700",
  },
];

function getPlateStyle(weight: number) {
  const plate =
    plateInfo.find((plate) => plate.weight >= weight) ??
    plateInfo[plateInfo.length - 1];

  return `${plate.height} ${plate.width} ${plate.color}`;
}

export function BarWithPlates({
  barWeight,
  plates,
  workoutId,
}: {
  barWeight: number;
  plates: string | number[] | null;
  workoutId: string;
}) {
  const searchParams = new URLSearchParams({
    back: "/app/workouts/" + workoutId,
  });
  return (
    <div className="flex items-center gap-0.25 w-full px-1 text-white">
      <div className="flex-none">
        <div className="flex items-center gap-0.25">
          <div className="flex items-center justify-center h-[20px] min-w-[30px] rounded-l-xs text-sm font-medium bg-gray-500">
            {barWeight}
          </div>

          {/* In case we have all availble plates */}
          {plates &&
            typeof plates === "object" &&
            plates.length > 0 &&
            plates
              .map((plate, index) => {
                const p = String(plate);
                const s = p.includes(".") ? [...p] : [p];
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-center rounded-xs text-sm font-medium",
                      `${getPlateStyle(plate)}`
                    )}
                  >
                    <div className="flex flex-col">
                      {s.map((char, i) => (
                        <div
                          key={i}
                          className={cn(
                            char == "." ? "leading-0.5 pl-0.5" : "leading-4"
                          )}
                        >
                          {char === "." ? `·` : char}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
              .reverse()}

          {/* Ohterwise, in case user needs to edit plates */}
          {plates &&
            typeof plates === "string" &&
            plates === "add plates..." && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-md text-sm font-medium",
                  `${getPlateStyle(55)}`
                )}
              >
                <Link
                  to={"/app/settings/plates?" + searchParams.toString()}
                  className="text-on-tertiary-container px-4 text-white"
                >
                  Edit
                </Link>
              </div>
            )}

          {/* Left bar */}

          <div className="flex items-center justify-center">
            <div className="h-[32px] min-w-[6px] rounded-sm  bg-gray-500" />
            <div className="h-[10px] min-w-[24px] bg-gray-500" />
          </div>
        </div>
      </div>
      <div className="grow">
        <div className="h-[10px] w-full bg-gray-500" />
      </div>
      <div className="flex-none">
        <div className="flex-none flex items-center gap-0.25 ml-auto">
          <div className="flex items-center justify-center">
            <div className="h-[10px] min-w-[24px] bg-gray-500" />
            <div className="h-[32px] min-w-[6px] rounded-sm  bg-gray-500" />
          </div>

          {/* In case we have all availble plates */}
          {plates &&
            typeof plates === "object" &&
            plates.length > 0 &&
            plates.map((plate, index) => {
              const p = String(plate);
              const s = p.includes(".") ? [...p] : [p];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-center rounded-xs text-sm font-medium",
                    `${getPlateStyle(plate)}`
                  )}
                >
                  <div className="flex flex-col">
                    {s.map((char, i) => (
                      <div
                        key={i}
                        className={cn(
                          char == "." ? "leading-0.5 pl-0.5" : "leading-4"
                        )}
                      >
                        {char === "." ? `·` : char}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* Ohterwise, in case user needs to edit plates */}
          {plates &&
            typeof plates === "string" &&
            plates === "add plates..." && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-md text-sm font-medium",
                  `${getPlateStyle(55)}`
                )}
              >
                <Link
                  to={"/app/settings/plates?" + searchParams.toString()}
                  className="text-on-tertiary-container px-4 text-white"
                >
                  Edit
                </Link>
              </div>
            )}

          <div className="flex items-center justify-center h-[20px] min-w-[30px] rounded-r-xs text-sm font-medium bg-gray-500">
            {barWeight}
          </div>
        </div>
      </div>
    </div>
  );
}
