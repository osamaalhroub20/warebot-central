import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Shelf } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Warehouse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

const Shelves = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState<Shelf | undefined>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: shelves, isLoading } = useQuery({
    queryKey: ["shelves"],
    queryFn: () => api.getShelves(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Shelf>) => api.createShelf(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelves"] });
      toast({ title: "Shelf created successfully" });
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shelf> }) =>
      api.updateShelf(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelves"] });
      toast({ title: "Shelf updated successfully" });
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteShelf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelves"] });
      toast({ title: "Shelf deleted successfully" });
    },
  });

  const handleFormSubmit = (data: any) => {
    const shelfData = {
      ...data,
      x_coord: parseInt(data.x_coord),
      y_coord: parseInt(data.y_coord),
      level: parseInt(data.level),
      available: data.available !== "false",
    };

    if (editingShelf) {
      updateMutation.mutate({ id: editingShelf.id, data: shelfData });
    } else {
      createMutation.mutate(shelfData);
    }
  };

  const handleEdit = (shelf: Shelf) => {
    setEditingShelf(shelf);
    reset(shelf);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this shelf?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingShelf(undefined);
    reset({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Shelves</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Shelf
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shelves?.map((shelf) => (
            <Card key={shelf.id} className="hover:shadow-elevated transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-primary" />
                    Shelf {shelf.id.slice(-6)}
                  </span>
                  <Badge variant={shelf.available ? "default" : "secondary"}>
                    {shelf.available ? "Available" : "Occupied"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warehouse:</span>
                    <span className="font-medium">{shelf.warehouse_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="font-medium">
                      ({shelf.x_coord}, {shelf.y_coord})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{shelf.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline">{shelf.status}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(shelf)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(shelf.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingShelf ? "Edit Shelf" : "Create Shelf"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="warehouse_id">Warehouse ID *</Label>
                <Input
                  id="warehouse_id"
                  {...register("warehouse_id", { required: true })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="x_coord">X Coordinate *</Label>
                  <Input
                    id="x_coord"
                    type="number"
                    {...register("x_coord", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="y_coord">Y Coordinate *</Label>
                  <Input
                    id="y_coord"
                    type="number"
                    {...register("y_coord", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Input
                    id="level"
                    type="number"
                    {...register("level", { required: true })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Input id="status" {...register("status")} defaultValue="IDLE" />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingShelf ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Shelves;
