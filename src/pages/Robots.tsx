import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, Battery, Cpu, Thermometer } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";

const Robots = () => {
  const { data: robots = [] } = useQuery({
    queryKey: ["robots"],
    queryFn: () => api.getRobots(),
  });

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
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Bot className="w-8 h-8" />
          Robots
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {robots.map((robot) => (
            <Card key={robot.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{robot.name}</CardTitle>
                  <StatusBadge status={robot.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {robot.battery_level !== null && (
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Battery</p>
                        <p className="font-medium">{robot.battery_level}%</p>
                      </div>
                    </div>
                  )}

                  {robot.cpu_usage !== null && (
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">CPU</p>
                        <p className="font-medium">{robot.cpu_usage}%</p>
                      </div>
                    </div>
                  )}

                  {robot.temperature !== null && (
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="font-medium">{robot.temperature}°C</p>
                      </div>
                    </div>
                  )}

                  {robot.x !== null && robot.y !== null && (
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="font-medium">
                        ({robot.x}, {robot.y})
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  {robot.available ? (
                    <Badge variant="outline" className="bg-success/10 text-success border-success">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                      Busy
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {robots.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No robots found
          </div>
        )}
      </main>
    </div>
  );
};

export default Robots;
