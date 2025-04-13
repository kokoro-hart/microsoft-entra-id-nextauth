import { auth } from "@/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  return (
    <main>
      <h2>Route：(protected)/page.tsx</h2>
      <section>
        <h2 className="flex items-center gap-2">
          <Image src="/microsoft.svg" alt="Microsoft" className="w-6 h-6" width={24} height={24} />
          Session：
        </h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </section>
    </main>
  );
}
