import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Edit, Trash2 } from "lucide-react";
import { Product } from "@/lib/api";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 group">
      <CardHeader className="p-0">
        <Link to={`/products/${product.id}`}>
          <div className="aspect-square bg-muted relative overflow-hidden">
            {product.main_image_url ? (
              <img
                src={product.main_image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            {product.quantity <= 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
            {product.quantity > 0 && product.quantity < 10 && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
        {product.category && (
          <Badge variant="secondary" className="mb-2">
            {product.category}
          </Badge>
        )}
        {product.price && (
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Package className="w-4 h-4" />
          Qty: {product.quantity}
        </span>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onEdit(product);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onDelete(product.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
