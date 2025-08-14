"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { Eye, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
    icon: React.ComponentType<{ className?: string }>;
  };
  variant?: "default" | "warning" | "success" | "destructive";
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "outline" | "secondary";
}

interface AlertItem {
  title: string;
  description: string;
  badge?: string;
  variant?: "default" | "warning" | "destructive";
}

interface ModuleHomepageProps {
  title: string;
  description: string;
  stats: StatCard[];
  quickActions: QuickAction[];
  alerts?: {
    title: string;
    description: string;
    items: AlertItem[];
    variant?: "default" | "warning" | "destructive";
  };
  recentItems?: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      badge?: string;
      href?: string;
    }>;
  };
}

export function ModuleHomepage({
  title,
  description,
  stats,
  quickActions,
  alerts,
  recentItems,
}: ModuleHomepageProps) {
  const { setTitle, setDescription } = useSidebar();
  useEffect(() => {
    setTitle(title);
    setDescription(description);
    return () => {
      setTitle("");
      setDescription("");
    };
  }, [title, description]);
  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Estadísticas principales */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.variant === "warning"
                      ? "text-yellow-500"
                      : stat.variant === "success"
                      ? "text-green-500"
                      : stat.variant === "destructive"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    stat.variant === "warning"
                      ? "text-yellow-600"
                      : stat.variant === "success"
                      ? "text-green-600"
                      : stat.variant === "destructive"
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {stat.trend && (
                    <>
                      <stat.trend.icon
                        className={`h-3 w-3 ${
                          stat.trend.isPositive
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                      <span
                        className={
                          stat.trend.isPositive
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {stat.trend.value}
                      </span>
                    </>
                  )}
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="block">
                  <div
                    className={`
                      group relative overflow-hidden rounded-lg border p-4 
                      transition-all duration-200 hover:shadow-md
                      ${
                        action.variant === "outline"
                          ? "border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary"
                          : "border-border bg-secondary/50 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      }
                      cursor-pointer h-auto min-h-[100px] flex flex-col justify-between
                    `}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <action.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight mb-1 break-words">
                          {action.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed break-words hyphens-auto">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Alertas */}
          {alerts && alerts.items.length > 0 && (
            <Card
              className={`${
                alerts.variant === "warning"
                  ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                  : alerts.variant === "destructive"
                  ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    alerts.variant === "warning"
                      ? "text-yellow-800 dark:text-yellow-200"
                      : alerts.variant === "destructive"
                      ? "text-red-800 dark:text-red-200"
                      : ""
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  {alerts.title}
                </CardTitle>
                <CardDescription
                  className={
                    alerts.variant === "warning"
                      ? "text-yellow-700 dark:text-yellow-300"
                      : alerts.variant === "destructive"
                      ? "text-red-700 dark:text-red-300"
                      : ""
                  }
                >
                  {alerts.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      {item.badge && (
                        <Badge
                          variant={item.variant || "outline"}
                          className="ml-2"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Elementos recientes */}
          {recentItems && recentItems.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{recentItems.title}</CardTitle>
                <CardDescription>{recentItems.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentItems.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="outline">{item.badge}</Badge>
                        )}
                        {item.href && (
                          <Button asChild variant="ghost" size="sm">
                            <Link href={item.href}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarInset>
  );
}
