import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CustomerSidebar } from "@/components/customer-sidebar";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <CustomerSidebar />
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
