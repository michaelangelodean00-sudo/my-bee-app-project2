
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Heart, ShoppingCart, Star, Upload, Car, Home, Cpu, Armchair, Shirt, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

// Define the categories
const categories = [
  { id: "vehicles", name: "Vehicles", icon: <Car size={16} /> },
  { id: "rentals", name: "Rentals", icon: <Home size={16} /> },
  { id: "electronics", name: "Electronics", icon: <Cpu size={16} /> },
  { id: "furniture", name: "Furniture", icon: <Armchair size={16} /> },
  { id: "menswear", name: "Menswear", icon: <Shirt size={16} /> },
  { id: "womenswear", name: "Womenswear", icon: <Quote size={16} /> }
];

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  whatsapp: z.string().regex(/^\+?[0-9]{10,15}$/, { message: "Please enter a valid WhatsApp number" }),
  image: z.instanceof(File).optional()
});

type FormValues = z.infer<typeof formSchema>;

const Ecommerce = () => {
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
      whatsapp: "",
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: FormValues) => {
    const newProduct = {
      id: `user-${Date.now()}`,
      name: data.name,
      price: data.price,
      rating: 5.0, // Default rating for new products
      image: imagePreview || "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=1000",
      category: data.category,
      description: data.description,
      whatsapp: data.whatsapp,
      isFeatured: false,
      isUserProduct: true
    };
    
    setUserProducts([...userProducts, newProduct]);
    setOpenDialog(false);
    setImagePreview(null);
    form.reset();
    toast.success("Your product has been listed successfully!");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-bee-black">Marketplace</h1>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-bee-blue hover:bg-bee-blue/90">
                  <Upload size={16} className="mr-2" />
                  List an Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>List Your Item</DialogTitle>
                  <DialogDescription>
                    Fill in the details to list your item on the marketplace.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  <span className="flex items-center gap-2">
                                    {category.icon}
                                    {category.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your product" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your WhatsApp number with country code
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a clear image of your product
                      </FormDescription>
                      {imagePreview && (
                        <div className="mt-2 relative h-40 w-full">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-full w-full object-cover rounded-md" 
                          />
                        </div>
                      )}
                    </FormItem>
                    
                    <DialogFooter>
                      <Button type="submit" className="w-full bg-bee-blue hover:bg-bee-blue/90">
                        List Product
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all">All Items</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    {category.icon}
                    {category.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[...productsData, ...userProducts].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[...productsData, ...userProducts]
                    .filter(p => p.category === category.id)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>
            ))}
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
    description?: string;
    whatsapp?: string;
    isFeatured: boolean;
    isUserProduct?: boolean;
  }
}

const ProductCard = ({ product }: ProductProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleWhatsAppClick = () => {
    if (product.whatsapp) {
      const url = `https://wa.me/${product.whatsapp.replace(/\+/g, '')}?text=Hi, I'm interested in your product: ${product.name}`;
      window.open(url, '_blank');
    }
  };
  
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
        {product.isUserProduct && (
          <Badge className="absolute top-2 left-2 bg-bee-blue text-white">
            New Listing
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
          <span className="text-gray-600">
            {categories.find(c => c.id === product.category)?.name || product.category}
          </span>
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
        
        {product.description && showDetails && (
          <div className="mt-2">
            <h4 className="font-semibold text-sm">Description:</h4>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex flex-col gap-2">
        {product.isUserProduct ? (
          <>
            {product.whatsapp && (
              <Button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Contact Seller
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </>
        ) : (
          <Button className="w-full bg-bee-blue hover:bg-bee-blue/90">
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Ecommerce;
