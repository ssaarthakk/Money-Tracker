import { auth } from "@/auth";
import AddTransactions from "@/components/AddTransactions";
import Balance from "@/components/Balance";
import IncomeExpense from "@/components/IncomeExpense";
import Login from "@/components/Login";
import Hero from "@/components/Hero";
import TransactionList from "@/components/TransactionList";
import Charts, { CategoryPieChart } from "@/components/Charts";
import Footer from "@/components/Footer";
import AppSidebar from "@/components/AppSidebar";
// Removed background decorative components from dashboard view

export default async function Home() {
  const session = await auth();

  return (
    <>
      {
        session?.user ? (
          <AppSidebar>
            <main className="space-y-6 relative overflow-x-hidden">
              <section className="space-y-6">
                {/* Top: Welcome + Balance (and quick KPIs) */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 w-full">
                  <h2 className="text-2xl font-semibold">Welcome back, {session.user.name}</h2>
                  <p className="text-white/70">Here&#39;s a quick snapshot of your finances.</p>
                  <div className="pt-4"><Balance /></div>
                  <div className="mt-2"><IncomeExpense /></div>
                </div>

                {/* Charts directly below Balance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Charts />
                  <CategoryPieChart />
                </div>

                {/* Below: Add Transaction and Transaction List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 w-full">
                    <h3 className="text-lg font-semibold mb-4">Add a transaction</h3>
                    <AddTransactions />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 w-full">
                    <TransactionList />
                  </div>
                </div>
              </section>
            </main>
          </AppSidebar>
        ) : (
          <div className="min-h-screen w-screen flex flex-col">
            <Hero />
          </div>
        )
      }
    </>
  );
}
