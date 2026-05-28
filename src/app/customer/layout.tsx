import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CustomerNavbar } from "@/components/customer-navbar";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Allow both customer and admin to access customer area (admin can test)
  // or restrict strictly. Let's restrict strictly if needed, but usually admin can also be a customer.
  // if ((session?.user as any).role !== "customer") {
  //   redirect("/"); 
  // }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <CustomerNavbar user={session.user} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
