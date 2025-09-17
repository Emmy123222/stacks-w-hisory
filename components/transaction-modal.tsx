"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, ExternalLink, Clock, Hash, User, Blocks, Coins } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import type { FetchAddressTransactionsResponse } from "@/lib/fetch-address-transactions"
import { abbreviateTxnId } from "@/lib/stx-utils"

interface TransactionModalProps {
  transaction: FetchAddressTransactionsResponse["results"][number] | null
  isOpen: boolean
  onClose: () => void
}

export function TransactionModal({ transaction, isOpen, onClose }: TransactionModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!transaction) return null

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "abort_by_response":
      case "abort_by_post_condition":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "token_transfer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "contract_call":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "smart_contract":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "coinbase":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Hash className="h-4 w-4 md:h-5 md:w-5" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs md:text-sm bg-muted px-2 py-1 rounded flex-1 break-all">
                      {transaction.tx.tx_id}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.tx.tx_id, "tx_id")}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">{copiedField === "tx_id" ? "Copied!" : "Copy"}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(transaction.tx.tx_status)}>{transaction.tx.tx_status}</Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <Badge className={getTypeColor(transaction.tx.tx_type)}>
                    {transaction.tx.tx_type.replace("_", " ")}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nonce</label>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span>{transaction.tx.nonce}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Block Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Blocks className="h-4 w-4 md:h-5 md:w-5" />
                Block Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Block Height</label>
                  <div className="flex items-center gap-2">
                    <Blocks className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{transaction.tx.block_height}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Block Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(transaction.tx.block_time)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Block Hash</label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">
                      {abbreviateTxnId(transaction.tx.block_hash)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.tx.block_hash, "block_hash")}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">{copiedField === "block_hash" ? "Copied!" : "Copy"}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Parent Block Hash</label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">
                      {abbreviateTxnId(transaction.tx.parent_block_hash)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.tx.parent_block_hash, "parent_block_hash")}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">
                        {copiedField === "parent_block_hash" ? "Copied!" : "Copy"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sender Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <User className="h-4 w-4 md:h-5 md:w-5" />
                Sender Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sender Address</label>
                <div className="flex items-center gap-2">
                  <code className="text-xs md:text-sm bg-muted px-2 py-1 rounded flex-1 break-all">
                    {transaction.tx.sender_address}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.tx.sender_address, "sender_address")}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">
                      {copiedField === "sender_address" ? "Copied!" : "Copy"}
                    </span>
                  </Button>
                  <Link href={`/${transaction.tx.sender_address}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction-specific details */}
          {transaction.tx.tx_type === "token_transfer" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Coins className="h-4 w-4 md:h-5 md:w-5" />
                  Token Transfer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                    <div className="flex items-center gap-2">
                      <code className="text-xs md:text-sm bg-muted px-2 py-1 rounded flex-1 break-all">
                        {transaction.tx.token_transfer.recipient_address}
                      </code>
                      <Link href={`/${transaction.tx.token_transfer.recipient_address}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-lg">
                        {(Number.parseFloat(transaction.tx.token_transfer.amount) / 1_000_000).toFixed(6)} STX
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.tx.tx_type === "contract_call" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Contract Call Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Contract ID</label>
                    <code className="text-xs md:text-sm bg-muted px-2 py-1 rounded block break-all">
                      {transaction.tx.contract_call.contract_id}
                    </code>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Function Name</label>
                    <code className="text-xs md:text-sm bg-muted px-2 py-1 rounded block">
                      {transaction.tx.contract_call.function_name}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.tx.tx_type === "smart_contract" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Smart Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Contract ID</label>
                    <code className="text-xs md:text-sm bg-muted px-2 py-1 rounded block break-all">
                      {transaction.tx.smart_contract.contract_id}
                    </code>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Clarity Version</label>
                    <span>{transaction.tx.smart_contract.clarity_version}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STX Events */}
          {(transaction.stx_sent !== "0" || transaction.stx_received !== "0") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Coins className="h-4 w-4 md:h-5 md:w-5" />
                  STX Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {transaction.stx_sent !== "0" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">STX Sent</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-red-600">
                          -{(Number.parseFloat(transaction.stx_sent) / 1_000_000).toFixed(6)} STX
                        </span>
                      </div>
                    </div>
                  )}

                  {transaction.stx_received !== "0" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">STX Received</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-green-600">
                          +{(Number.parseFloat(transaction.stx_received) / 1_000_000).toFixed(6)} STX
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* External Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">External Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Link
                  href={`https://explorer.hiro.so/txid/${transaction.tx.tx_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="flex items-center gap-2 text-sm bg-transparent">
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">View on Hiro Explorer</span>
                    <span className="sm:hidden">Hiro Explorer</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
