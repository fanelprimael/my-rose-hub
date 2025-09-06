import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, icon, description, trend }: StatsCardProps) => {
  return (
    <Card className="shadow-soft hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-education-success' : 'text-education-danger'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs mois dernier
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};