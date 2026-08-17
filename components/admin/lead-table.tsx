"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/lib/types";
import { toast } from "sonner";

const statusVariant: Record<LeadStatus, "warning" | "success" | "muted"> = {
  new: "warning",
  contacted: "muted",
  responded: "success",
  converted: "success",
  not_interested: "muted",
};

const statusLabel: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  responded: "Responded",
  converted: "Converted",
  not_interested: "Not Interested",
};

const businessTypeLabel: Record<string, string> = {
  gun_range: "Gun Range",
  retail_store: "Retail Store",
  sporting_goods: "Sporting Goods",
  distributor: "Distributor",
  ecommerce_retailer: "Ecommerce Retailer",
  other: "Other",
};

export function LeadTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const filtered = tab === "all" ? leads : leads.filter((l) => l.status === tab);

  async function updateStatus(id: string, status: LeadStatus) {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update lead");
      toast.success("Lead status updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function saveNotes(id: string) {
    const notes = notesDraft[id];
    if (notes === undefined) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function deleteLead(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lead");
      toast.success("Lead removed");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    responded: leads.filter((l) => l.status === "responded").length,
    converted: leads.filter((l) => l.status === "converted").length,
    not_interested: leads.filter((l) => l.status === "not_interested").length,
  };

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="new">New ({counts.new})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({counts.contacted})</TabsTrigger>
          <TabsTrigger value="responded">Responded ({counts.responded})</TabsTrigger>
          <TabsTrigger value="converted">Converted ({counts.converted})</TabsTrigger>
          <TabsTrigger value="not_interested">Not Interested ({counts.not_interested})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="min-w-[220px]">Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No leads in this view yet.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <p className="font-medium">{lead.business_name}</p>
                  {lead.website && (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {lead.website.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {lead.contact_name && <p>{lead.contact_name}</p>}
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} className="block hover:text-foreground hover:underline">
                      {lead.email}
                    </a>
                  )}
                  {lead.phone && <p>{lead.phone}</p>}
                  {!lead.contact_name && !lead.email && !lead.phone && "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {lead.business_type ? businessTypeLabel[lead.business_type] ?? lead.business_type : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {[lead.city, lead.region].filter(Boolean).join(", ") || "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{lead.source ?? "—"}</TableCell>
                <TableCell>
                  <Textarea
                    defaultValue={lead.notes ?? ""}
                    onChange={(e) => setNotesDraft((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                    onBlur={() => saveNotes(lead.id)}
                    placeholder="Add a note…"
                    className="min-h-[2.25rem] text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v as LeadStatus)}>
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue>
                        <Badge variant={statusVariant[lead.status]}>{statusLabel[lead.status]}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusLabel) as LeadStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabel[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    disabled={deletingId === lead.id}
                    onClick={() => deleteLead(lead.id)}
                    title="Remove lead"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
