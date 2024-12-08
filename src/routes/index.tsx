import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    return redirect({
      to: "/auth/login",
    });
  }
});

function Index() {
  return (
    <></>
  );
}
