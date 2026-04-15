import { Suspense } from "react";
import GDJoinPage from "./GDJoinPage";

export default function Page() {
  return (
    <Suspense>
      <GDJoinPage />
    </Suspense>
  );
}