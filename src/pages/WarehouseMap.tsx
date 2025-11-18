import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const WarehouseMap = () => {
  const { data: mapData, isLoading } = useQuery({
    queryKey: ["warehouse-map"],
    queryFn: () => api.getWarehouseMap(),
  });

  const { data: shelves = [] } = useQuery({
    queryKey: ["shelves"],
    queryFn: () => api.getShelves(),
  });

  const { data: robots = [] } = useQuery({
    queryKey: ["robots"],
    queryFn: () => api.getRobots(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapIcon className="w-6 h-6" />
              Warehouse Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-8 min-h-[600px] relative">
              <svg width="100%" height="600" viewBox="0 0 800 600" className="border rounded">
                {/* Grid Background */}
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="800" height="600" fill="url(#grid)" />

                {/* Shelves */}
                {shelves.map((shelf) => (
                  <g key={shelf.id}>
                    <rect
                      x={shelf.x_coord * 40}
                      y={shelf.y_coord * 40}
                      width="35"
                      height="35"
                      fill="hsl(var(--primary))"
                      opacity="0.7"
                      rx="4"
                    />
                    <text
                      x={shelf.x_coord * 40 + 17.5}
                      y={shelf.y_coord * 40 + 22}
                      fontSize="10"
                      fill="white"
                      textAnchor="middle"
                    >
                      S{shelf.level}
                    </text>
                  </g>
                ))}

                {/* Robots */}
                {robots.map(
                  (robot) =>
                    robot.x !== null &&
                    robot.y !== null && (
                      <g key={robot.id}>
                        <circle
                          cx={robot.x * 40 + 20}
                          cy={robot.y * 40 + 20}
                          r="15"
                          fill="hsl(var(--secondary))"
                          stroke="hsl(var(--foreground))"
                          strokeWidth="2"
                        />
                        <text
                          x={robot.x * 40 + 20}
                          y={robot.y * 40 + 25}
                          fontSize="10"
                          fill="white"
                          textAnchor="middle"
                        >
                          R
                        </text>
                      </g>
                    )
                )}
              </svg>

              <div className="mt-4 flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded opacity-70" />
                  <span className="text-sm">Shelf</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-secondary rounded-full border-2 border-foreground" />
                  <span className="text-sm">Robot</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WarehouseMap;
