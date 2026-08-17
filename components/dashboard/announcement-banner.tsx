import { Megaphone } from "lucide-react";

const announcements = [
  {
    title: "Holiday Havoc Seasonal Set drops this week",
    body: "Limited run of 20-packs — reserve inventory before it sells out.",
  },
  {
    title: "Free shipping threshold reminder",
    body: "Orders over $1,000 ship free. Bundle with your next reorder to save.",
  },
];

export function AnnouncementBanner() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold">Retailer Announcements</h3>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {announcements.map((a) => (
          <div key={a.title} className="border-l-2 border-primary/40 pl-3">
            <p className="text-sm font-medium">{a.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
