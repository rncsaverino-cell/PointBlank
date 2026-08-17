"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Ban, RotateCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { businessTypes } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import type { Profile, RetailerStatus } from "@/lib/types";
import { toast } from "sonner";

const statusVariant: Record<RetailerStatus, "warning" | "success" | "muted"> = {
  pending: "warning",
  approved: "success",
  rejected: "muted",
  suspended: "muted",
};

export function RetailerTable({ retailers }: { retailers: Profile[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | RetailerStatus>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = tab === "all" ? retailers : retailers.filter((r) => r.retailer_status === tab);

  async function updateStatus(id: string, status: RetailerStatus) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/retailers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update retailer");
      toast.success(`Retailer ${status}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  async function updateTier(id: string, tier: string) {
    await fetch(`/api/admin/retailers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricing_tier: tier }),
    });
    toast.success("Pricing tier updated");
    router.refresh();
  }

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All ({retailers.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({retailers.filter((r) => r.retailer_status === "pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({retailers.filter((r) => r.retailer_status === "approved").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({retailers.filter((r) => r.retailer_status === "rejected").length})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({retailers.filter((r) => r.retailer_status === "suspended").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Pricing Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <p className="font-medium">{r.business_name}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.contact_first_name} {r.contact_last_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {businessTypes.find((t) => t.value === r.business_type)?.label ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(r.created_at)}</TableCell>
                <TableCell>
                  <Select defaultValue={r.pricing_tier ?? "standard"} onValueChange={(v) => updateTier(r.id, v)}>
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="strategic">Strategic</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[r.retailer_status]}>{r.retailer_status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    {r.retailer_status !== "approved" && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={loadingId === r.id}
                        onClick={() => updateStatus(r.id, "approved")}
                        title="Approve"
                      >
                        <Check className="h-3.5 w-3.5 text-success" />
                      </Button>
                    )}
                    {r.retailer_status === "pending" && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={loadingId === r.id}
                        onClick={() => updateStatus(r.id, "rejected")}
                        title="Reject"
                      >
                        <X className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                    {r.retailer_status === "approved" && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={loadingId === r.id}
                        onClick={() => updateStatus(r.id, "suspended")}
                        title="Suspend"
                      >
                        <Ban className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                    {(r.retailer_status === "suspended" || r.retailer_status === "rejected") && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={loadingId === r.id}
                        onClick={() => updateStatus(r.id, "approved")}
                        title="Reinstate"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-success" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
