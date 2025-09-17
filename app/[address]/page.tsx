import { TransactionsList } from "@/components/txns-list"
import { fetchAddressTransactions } from "@/lib/fetch-address-transactions"
import { AddressBalance } from "../../components/address-balance"
import { ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

export default async function Activity({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>
  searchParams: Promise<{ network?: "mainnet" | "testnet" }>
}) {
  // params contains parameters we can parse from the URL Route
  const { address } = await params
  const { network = "mainnet" } = await searchParams

  // Once we know the address, we fetch the initial 20 transactions
  const initialTransactions = await fetchAddressTransactions({ address, network })

  const explorerUrl =
    network === "testnet"
      ? `https://explorer.hiro.so/address/${address}?chain=testnet`
      : `https://explorer.hiro.so/address/${address}`

  return (
    <main className="flex h-[100vh-4rem] flex-col p-4 md:p-8 gap-6 md:gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold break-all">{address}</h1>
        <Link
          href={explorerUrl}
          target="_blank"
          className="rounded-lg flex gap-1 bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-fit"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          <span className="hidden sm:inline">View on Hiro</span>
          <span className="sm:hidden">Hiro</span>
        </Link>
      </div>

      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4">Balance Overview</h2>
        <AddressBalance address={address} />
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4">Transaction History</h2>
        <TransactionsList address={address} transactions={initialTransactions} />
      </section>
    </main>
  )
}
