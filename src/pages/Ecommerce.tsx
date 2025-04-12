
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const productsData = [
  {
    id: "prod1",
    name: "Bahamian Straw Beach Bag",
    price: 45.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000",
    category: "Accessories",
    isFeatured: true
  },
  {
    id: "prod2",
    name: "Handcrafted Shell Necklace",
    price: 22.50,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000",
    category: "Jewelry",
    isFeatured: true
  },
  {
    id: "prod3",
    name: "Island Spice Blend Set",
    price: 18.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=1000",
    category: "Food",
    isFeatured: true
  },
  {
    id: "prod4",
    name: "Traditional Junkanoo Art Print",
    price: 35.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?q=80&w=1000",
    category: "Home Decor",
    isFeatured: false
  },
  {
    id: "prod5",
    name: "Bahamian Rum Cake",
    price: 29.99,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1557925923-cd4648e211a0?q=80&w=1000",
    category: "Food",
    isFeatured: false
  },
  {
    id: "prod6",
    name: "Tropical Print Summer Shirt",
    price: 38.50,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517940310602-26535839fe84?q=80&w=1000",
    category: "Clothing",
    isFeatured: false
  }
];

const Ecommerce = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6 text-bee-black">Shop Local Products</h1>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="clothing">Clothing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {productsData.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="featured">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {productsData.filter(p => p.isFeatured).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="accessories">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {productsData.filter(p => p.category === "Accessories").map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="food">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {productsData.filter(p => p.category === "Food").map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="clothing">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {productsData.filter(p => p.category === "Clothing").map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    category: string;
    isFeatured: boolean;
  }
}

const ProductCard = ({ product }: ProductProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-bee-yellow text-bee-black">
            Featured
          </Badge>
        )}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full hover:bg-gray-100">
          <Heart size={16} className="text-gray-600" />
        </button>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{product.name}</CardTitle>
        <div className="flex items-center text-sm">
          <Tag size={14} className="text-gray-500 mr-1" />
          <span className="text-gray-600">{product.category}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < Math.floor(product.rating) ? "text-bee-yellow fill-bee-yellow" : "text-gray-300"} 
            />
          ))}
          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
        </div>
        <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-bee-blue hover:bg-bee-blue/90">
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Ecommerce;
