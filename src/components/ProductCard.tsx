import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin } from "lucide-react";
import { Product } from "@/lib/api";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-elevated transition-shadow cursor-pointer">
        <CardHeader className="p-0">
          <div className="aspect-square bg-muted relative">
            {product.main_image_url ? (
              <img
                src={product.main_image_url}
                alt={product.name}
                className="w-full h-full object-cover"
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
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
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
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            Qty: {product.quantity}
          </span>
          {product.shelf_id && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Shelf
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};
