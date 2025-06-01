import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Heart, ShoppingCart, Star, Upload, Car, Home, Phone, Armchair, Shirt, Quote, Baby, Smartphone, Tv, Video, MessageCircle } from "lucide-react";
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
import { useNotifications } from "../contexts/NotificationContext";

// Mock e-commerce videos
const ecommerceVideos = [
  {
    id: "1",
    platform: "instagram",
    videoUrl: "https://instagram.com/reel/example1",
    title: "Vintage Watch Collection",
    description: "Check out these amazing vintage watches! Perfect condition, great prices. Message me for details!",
    isNew: true
  },
  {
    id: "2",
    platform: "tiktok", 
    videoUrl: "https://tiktok.com/@example2",
    title: "Fashion Haul 2024",
    description: "Latest fashion trends and styles. Get 20% off with code FASHION20!",
    isNew: true
  },
  {
    id: "3",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example3",
    title: "Electronics Review",
    description: "Unboxing and reviewing the latest gadgets. Contact me through BEE messenger for best deals!",
    isNew: false
  },
  {
    id: "4",
    platform: "facebook",
    videoUrl: "https://facebook.com/video/example4",
    title: "Home Decor Ideas",
    description: "Transform your space with these affordable home decor pieces!",
    isNew: true
  }
];

const categories = [
  { id: "vehicles", name: "Vehicles", icon: <Car size={16} /> },
  { id: "rentals", name: "Rentals", icon: <Home size={16} /> },
  { id: "realestate", name: "Real Estate", icon: <Home size={16} /> },
  { id: "electronics", name: "Electronics", icon: <Tv size={16} /> },
  { id: "furniture", name: "Furniture", icon: <Armchair size={16} /> },
  { id: "menswear", name: "Menswear", icon: <Shirt size={16} /> },
  { id: "womenswear", name: "Womenswear", icon: <Quote size={16} /> },
  { id: "babyclothing", name: "Baby Clothing", icon: <Baby size={16} /> }
];

const formSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.instanceof(File).optional()
});

type FormValues = z.infer<typeof formSchema>;

const Ecommerce = () => {
  const { markEcommerceItemsAsViewed } = useNotifications();
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
    }
  });

  // Mark ecommerce items as viewed when the component mounts
  useEffect(() => {
    markEcommerceItemsAsViewed();
  }, [markEcommerceItemsAsViewed]);
  
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
      rating: 5.0,
      image: imagePreview || "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=1000",
      category: data.category,
      description: data.description,
      seller: "You",
      isFeatured: false,
      isUserProduct: true
    };
    
    setUserProducts([...userProducts, newProduct]);
    setOpenDialog(false);
    setImagePreview(null);
    form.reset();
    toast.success("Your product has been listed successfully!");
  };

  const handleMessageSeller = (sellerName: string) => {
    setSelectedSeller(sellerName);
    setMessageDialog(true);
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      toast.success(`Message sent to ${selectedSeller} through BEE messenger!`);
      setMessageDialog(false);
      setMessageText("");
      setSelectedSeller("");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
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
                    Fill in the details to list your item on the marketplace. Buyers will contact you through BEE messenger.
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

          {/* Message Dialog */}
          <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
                <DialogDescription>
                  Send a message to {selectedSeller} through BEE messenger
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMessageDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={sendMessage} className="bg-bee-blue hover:bg-bee-blue/90">
                  <MessageCircle size={16} className="mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Tabs defaultValue="videos" className="mb-6">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="videos">
                <span className="flex items-center gap-2">
                  <Video size={16} />
                  Shopping Videos
                </span>
              </TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    {category.icon}
                    {category.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="videos">
              <div className="bg-black rounded-lg overflow-hidden">
                <h2 className="text-xl font-bold py-4 px-4 text-white text-center bg-black">Shopping Videos</h2>
                
                {/* TikTok-style video feed */}
                <div className="max-w-md mx-auto">
                  {ecommerceVideos.map((video) => (
                    <div key={video.id} className="h-screen snap-y snap-mandatory">
                      <VideoPlayer
                        platform={video.platform}
                        videoUrl={video.videoUrl}
                        title={video.title}
                        description={video.description}
                        isNew={video.isNew}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {userProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onMessageSeller={handleMessageSeller} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="bg-gray-100 rounded-xl p-8 max-w-lg mx-auto">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No products listed yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Get started by listing your first item on the marketplace.
                    </p>
                    <Button 
                      className="mt-6 bg-bee-blue hover:bg-bee-blue/90"
                      onClick={() => setOpenDialog(true)}
                    >
                      List an Item
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                {userProducts.filter(p => p.category === category.id).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {userProducts
                      .filter(p => p.category === category.id)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} onMessageSeller={handleMessageSeller} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="bg-gray-100 rounded-xl p-8 max-w-lg mx-auto">
                      {category.icon && React.cloneElement(category.icon, { className: "mx-auto h-12 w-12 text-gray-400" })}
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No {category.name} listed yet</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Be the first to list a {category.name.toLowerCase()} item on the marketplace.
                      </p>
                      <Button 
                        className="mt-6 bg-bee-blue hover:bg-bee-blue/90"
                        onClick={() => setOpenDialog(true)}
                      >
                        List an Item
                      </Button>
                    </div>
                  </div>
                )}
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
    seller?: string;
    isFeatured: boolean;
    isUserProduct?: boolean;
  };
  onMessageSeller: (sellerName: string) => void;
}

const ProductCard = ({ product, onMessageSeller }: ProductProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
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
            <Button 
              onClick={() => onMessageSeller(product.seller || "Seller")}
              className="w-full bg-bee-blue hover:bg-bee-blue/90"
            >
              <MessageCircle size={16} className="mr-2" />
              Message Seller
            </Button>
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
