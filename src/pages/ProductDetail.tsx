import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, Box } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: locationData, isLoading } = useQuery({
    queryKey: ["product-location", id],
    queryFn: () => api.getProductLocation(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p>Product not found</p>
      </div>
    );
  }

  const { product, shelf, shelf_products } = locationData;

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                {product.main_image_url ? (
                  <img
                    src={product.main_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-32 h-32 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>

                {product.category && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Category</p>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                )}

                {product.brand && (
                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                )}

                {product.price && (
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-3xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium text-xl">{product.quantity}</p>
                </div>

                {product.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {shelf && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Warehouse</p>
                  <p className="font-medium">{shelf.warehouse_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">
                    X: {shelf.x_coord}, Y: {shelf.y_coord}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium">{shelf.level}</p>
                </div>
              </div>

              {shelf_products && shelf_products.length > 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5" />
                    Other Products on This Shelf
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shelf_products
                      .filter((p: any) => p.id !== product.id)
                      .map((p: any) => (
                        <Link key={p.id} to={`/products/${p.id}`}>
                          <Card className="hover:shadow-elevated transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-1">{p.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Qty: {p.quantity}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
