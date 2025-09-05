import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/app/program/:routineId/add-exercises": {
    "routineId": string;
  };
  "/app/progress/exercise/:exerciseId": {
    "exerciseId": string;
  };
  "/app/program/:programId/edit": {
    "programId": string;
  };
  "/app/workouts/:workoutId": {
    "workoutId": string;
  };
  "/app": {};
  "/app/program/:routineId": {
    "routineId": string;
  };
  "/app/settings/plates": {};
  "/app/program/change": {};
  "/app/progress": {};
  "/app/settings": {};
  "/app/history": {};
  "/app/program": {};
  "/app/queue": {};
  "/*": {
    "*": string;
  };
};