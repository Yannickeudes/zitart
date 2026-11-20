import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/auth";

async function NavWithSession() {
  const session = await getSession();
  return <Navbar user={session} />;
}

export default function NavServer() {
  return (
    <Suspense fallback={<Navbar user={null} />}>
      <NavWithSession />
    </Suspense>
  );
}
