import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Bot,
  Warehouse,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    api.clearToken();
    toast({
      title: "Logged out successfully",
    });
    navigate("/login");
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">
              Warebot
            </Link>
            <div className="hidden md:flex gap-1">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="ghost" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link to="/shelves">
                <Button variant="ghost" size="sm">
                  <Warehouse className="w-4 h-4 mr-2" />
                  Shelves
                </Button>
              </Link>
              <Link to="/robots">
                <Button variant="ghost" size="sm">
                  <Bot className="w-4 h-4 mr-2" />
                  Robots
                </Button>
              </Link>
              <Link to="/tasks">
                <Button variant="ghost" size="sm">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Tasks
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="ghost" size="sm">
                  <Warehouse className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </Link>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
