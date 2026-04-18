import { Card, CardContent } from "@/components/ui/card";

// Translated comment.
// Translated comment.
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend?: "up" | "down";
}

export function StatCard({ title, value, icon, change, trend }: StatCardProps) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm transition-all hover:border-zinc-700">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-zinc-800 rounded-md">{icon}</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`${
              trend === "down" ? "text-red-400" : "text-emerald-400"
            } font-medium`}
          >
            {change}
          </span>
          <span className="text-zinc-500">vs geçen ay</span>
        </div>
      </CardContent>
    </Card>
  );
}
