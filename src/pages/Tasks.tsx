import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Task } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

const Tasks = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.getTasks(),
  });

  const { data: shelves } = useQuery({
    queryKey: ["shelves"],
    queryFn: () => api.getShelves(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { shelf_id: string; priority: number; description?: string }) =>
      api.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task created and assigned successfully" });
      handleCloseForm();
    },
    onError: () => {
      toast({ title: "Failed to create task", variant: "destructive" });
    },
  });

  const handleFormSubmit = (data: any) => {
    createMutation.mutate({
      shelf_id: data.shelf_id,
      priority: parseInt(data.priority),
      description: data.description,
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    reset({});
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "outline";
      case "RUNNING":
        return "default";
      case "DONE":
        return "secondary";
      case "ERROR":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Tasks</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        <div className="space-y-4">
          {tasks?.map((task) => (
            <Card key={task.id} className="hover:shadow-elevated transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge variant="outline">Priority: {task.priority}</Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Shelf ID: </span>
                          <span className="font-medium">
                            {task.shelf_id.slice(-6)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Assigned to: </span>
                          <span className="font-medium">{task.assigned_robot_name}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(task.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="shelf_id">Shelf *</Label>
                <select
                  id="shelf_id"
                  {...register("shelf_id", { required: true })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a shelf</option>
                  {shelves?.map((shelf) => (
                    <option key={shelf.id} value={shelf.id}>
                      {shelf.warehouse_id} - ({shelf.x_coord}, {shelf.y_coord}) Level{" "}
                      {shelf.level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="priority">Priority (1-10) *</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="5"
                  {...register("priority", { required: true })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  placeholder="Optional task description..."
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Tasks;
