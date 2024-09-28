import { auth } from "@/auth";
import AddTransactions from "@/components/AddTransactions";
import Balance from "@/components/Balance";
import IncomeExpense from "@/components/IncomeExpense";
import Login from "@/components/Login";
import Navbar from "@/components/Navbar";
import TransactionList from "@/components/TransactionList";
import Head from "next/head";

export default async function Home() {
  const session = await auth();
  
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
        {
          session?.user? (
            <div className="h-screen max-w-screen overflow-x-hidden">
            <Navbar />
            <div className="flex md:flex-row flex-col">
            <div className="h-[88vh] md:w-1/2 flex flex-col gap-2">
              <h1 className="text-center text-4xl md:text-6xl font-bold pt-16">Welcome, {session.user.name}</h1>
              <Balance />
              <AddTransactions />
            </div>
            <div className="h-[88vh] pb-4 md:w-1/2 w-full flex flex-col gap-2 md:pl-0 px-4">
              <IncomeExpense />
              <TransactionList />
            </div>
            </div>
            </div>
          ) : (
            <div className="h-screen w-screen flex justify-center items-center">
            <Login />
            </div>
          )
        }
    </>
  );
}
