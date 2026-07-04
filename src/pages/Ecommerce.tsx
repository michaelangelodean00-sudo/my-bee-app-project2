import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Heart, ShoppingCart, Star, Upload, Car, Home, Phone, Armchair, Shirt, Quote, Baby, Smartphone, Tv, MessageCircle, Microwave, Truck, Trash2, Ban, Shield, Edit } from "lucide-react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  { id: "vehicles", name: "Vehicles", icon: <Car size={16} />, subCategories: [
    { id: "cars", name: "Cars", icon: <Car size={16} /> },
    { id: "suv", name: "SUV", icon: <Car size={16} /> },
    { id: "trucks", name: "Trucks", icon: <Truck size={16} /> }
  ]},
  { id: "rentals", name: "Rentals", icon: <Home size={16} /> },
  { id: "realestate", name: "Real Estate", icon: <Home size={16} /> },
  { id: "electronics", name: "Electronics", icon: <Tv size={16} /> },
  { id: "appliances", name: "Appliances", icon: <Microwave size={16} /> },
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
  subCategory: z.string().optional(),
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Simple admin check - in a real app this would come from authentication
  const isAdmin = true; // Set to true for demo purposes
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
      subCategory: "",
    }
  });

  const editForm = useForm<{ price: number; description: string }>({
    resolver: zodResolver(z.object({
      price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
      description: z.string().min(10, { message: "Description must be at least 10 characters" })
    })),
    defaultValues: {
      price: 0,
      description: ""
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
      
      image: imagePreview || "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=1000",
      category: data.category,
      subCategory: data.subCategory,
      description: data.description,
      seller: "You",
      isFeatured: false,
      isUserProduct: true
    };
    
    setUserProducts([...userProducts, newProduct]);
    setOpenDialog(false);
    setImagePreview(null);
    form.reset();
    setSelectedCategory("");
    toast.success("Your product has been listed successfully!");
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  
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

  const handleDeleteProduct = (productId: string) => {
    setUserProducts(userProducts.filter(product => product.id !== productId));
    toast.success("Product deleted successfully");
  };

  const handleBlockUser = (seller: string) => {
    if (!blockedUsers.includes(seller)) {
      setBlockedUsers([...blockedUsers, seller]);
      toast.success(`User ${seller} has been blocked`);
    }
  };

  const handleUnblockUser = (seller: string) => {
    setBlockedUsers(blockedUsers.filter(user => user !== seller));
    toast.success(`User ${seller} has been unblocked`);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistItems(prev => {
      if (prev.includes(productId)) {
        toast.success("Removed from wishlist");
        return prev.filter(id => id !== productId);
      } else {
        toast.success("Added to wishlist");
        return [...prev, productId];
      }
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    editForm.setValue("price", product.price);
    editForm.setValue("description", product.description);
    setEditDialog(true);
  };

  const onEditSubmit = (data: { price: number; description: string }) => {
    setUserProducts(prev => 
      prev.map(product => 
        product.id === editingProduct.id 
          ? { ...product, price: data.price, description: data.description }
          : product
      )
    );
    setEditDialog(false);
    setEditingProduct(null);
    editForm.reset();
    toast.success("Product updated successfully!");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        <div className="flex-1 max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="heading-small">Marketplace</h1>
              {isAdmin && (
                <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                  <Shield size={14} className="mr-1" />
                  Admin Mode
                </Badge>
              )}
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button variant="premium">
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
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                            form.setValue("subCategory", "");
                          }} defaultValue={field.value}>
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
                    
                    {selectedCategoryData?.subCategories && (
                      <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub-Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a sub-category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedCategoryData.subCategories.map((subCategory) => (
                                  <SelectItem key={subCategory.id} value={subCategory.id}>
                                    <span className="flex items-center gap-2">
                                      {subCategory.icon}
                                      {subCategory.name}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
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
                      <Button type="submit" className="w-full" variant="premium">
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
                <Button onClick={sendMessage} variant="premium">
                  <MessageCircle size={16} className="mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>

          {/* Edit Product Dialog */}
          <Dialog open={editDialog} onOpenChange={setEditDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update the price and description for "{editingProduct?.name}"
                </DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
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
                    control={editForm.control}
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
                  
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="premium">
                        <Edit size={16} className="mr-2" />
                        Update Product
                      </Button>
                    </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Tabs defaultValue="products" className="mb-6">
            <TabsList className="flex flex-wrap w-full gap-2 h-auto p-3 bg-card border rounded-lg">
              <TabsTrigger value="products" className="text-base font-semibold py-3 px-6 rounded-md bg-background text-foreground border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm transition-all whitespace-nowrap">
                Products
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="text-base font-semibold py-3 px-6 rounded-md bg-background text-foreground border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm transition-all whitespace-nowrap">
                <Heart size={16} className="mr-2" />
                Wishlist ({wishlistItems.length})
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="text-base font-semibold py-3 px-6 rounded-md bg-background text-foreground border border-border flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm transition-all hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
                >
                  <span className="flex-shrink-0">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="products">
              {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {userProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onMessageSeller={handleMessageSeller}
                      isAdmin={isAdmin}
                      onDeleteProduct={handleDeleteProduct}
                      onBlockUser={handleBlockUser}
                      onUnblockUser={handleUnblockUser}
                      isUserBlocked={blockedUsers.includes(product.seller || "")}
                      onToggleWishlist={handleToggleWishlist}
                      isInWishlist={wishlistItems.includes(product.id)}
                      onEditProduct={handleEditProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="bg-muted rounded-xl p-8 max-w-lg mx-auto">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 heading-xs">No products listed yet</h3>
                    <p className="mt-2 body-small text-muted-foreground">
                      Get started by listing your first item on the marketplace.
                    </p>
                    <Button 
                      className="mt-6"
                      variant="premium"
                      onClick={() => setOpenDialog(true)}
                    >
                      List an Item
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="wishlist">
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {userProducts
                    .filter(product => wishlistItems.includes(product.id))
                    .map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onMessageSeller={handleMessageSeller}
                        isAdmin={isAdmin}
                        onDeleteProduct={handleDeleteProduct}
                        onBlockUser={handleBlockUser}
                        onUnblockUser={handleUnblockUser}
                        isUserBlocked={blockedUsers.includes(product.seller || "")}
                        onToggleWishlist={handleToggleWishlist}
                        isInWishlist={wishlistItems.includes(product.id)}
                        onEditProduct={handleEditProduct}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="bg-gray-100 rounded-xl p-8 max-w-lg mx-auto">
                    <Heart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Browse products and click the heart icon to save items for later.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                {category.subCategories ? (
                  <div className="space-y-6">
                    <Tabs defaultValue={category.subCategories[0].id} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1">
                        {category.subCategories.map((subCategory) => (
                          <TabsTrigger key={subCategory.id} value={subCategory.id} className="text-xs sm:text-sm flex items-center gap-1">
                            {subCategory.icon}
                            <span className="truncate">{subCategory.name}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {category.subCategories.map((subCategory) => (
                        <TabsContent key={subCategory.id} value={subCategory.id}>
                          {userProducts.filter(p => p.category === category.id && p.subCategory === subCategory.id).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                              {userProducts
                                .filter(p => p.category === category.id && p.subCategory === subCategory.id)
                                .map((product) => (
                                  <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onMessageSeller={handleMessageSeller}
                                    isAdmin={isAdmin}
                                    onDeleteProduct={handleDeleteProduct}
                                    onBlockUser={handleBlockUser}
                                     onUnblockUser={handleUnblockUser}
                                     isUserBlocked={blockedUsers.includes(product.seller || "")}
                                     onToggleWishlist={handleToggleWishlist}
                                     isInWishlist={wishlistItems.includes(product.id)}
                                     onEditProduct={handleEditProduct}
                                   />
                                 ))}
                             </div>
                           ) : (
                            <div className="text-center py-12 px-4">
                              <div className="bg-muted rounded-xl p-8 max-w-lg mx-auto">
                                {subCategory.icon && React.cloneElement(subCategory.icon, { className: "mx-auto h-12 w-12 text-muted-foreground" })}
                                <h3 className="mt-4 heading-xs">No {subCategory.name} listed yet</h3>
                                <p className="mt-2 body-small text-muted-foreground">
                                  Be the first to list a {subCategory.name.toLowerCase()} item on the marketplace.
                                </p>
                                <Button 
                                  className="mt-6"
                                  variant="premium"
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
                ) : (
                  userProducts.filter(p => p.category === category.id).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {userProducts
                        .filter(p => p.category === category.id)
                        .map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onMessageSeller={handleMessageSeller}
                            isAdmin={isAdmin}
                            onDeleteProduct={handleDeleteProduct}
                            onBlockUser={handleBlockUser}
                             onUnblockUser={handleUnblockUser}
                             isUserBlocked={blockedUsers.includes(product.seller || "")}
                             onToggleWishlist={handleToggleWishlist}
                             isInWishlist={wishlistItems.includes(product.id)}
                             onEditProduct={handleEditProduct}
                           />
                         ))}
                     </div>
                   ) : (
                    <div className="text-center py-12 px-4">
                      <div className="bg-muted rounded-xl p-8 max-w-lg mx-auto">
                        {category.icon && React.cloneElement(category.icon, { className: "mx-auto h-12 w-12 text-muted-foreground" })}
                        <h3 className="mt-4 heading-xs">No {category.name} listed yet</h3>
                        <p className="mt-2 body-small text-muted-foreground">
                          Be the first to list a {category.name.toLowerCase()} item on the marketplace.
                        </p>
                        <Button 
                          className="mt-6"
                          variant="premium"
                          onClick={() => setOpenDialog(true)}
                        >
                          List an Item
                        </Button>
                      </div>
                    </div>
                  )
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
    
    image: string;
    category: string;
    description?: string;
    seller?: string;
    isFeatured: boolean;
    isUserProduct?: boolean;
  };
  onMessageSeller: (sellerName: string) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (productId: string) => void;
  onBlockUser?: (seller: string) => void;
  onUnblockUser?: (seller: string) => void;
  isUserBlocked?: boolean;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  onEditProduct?: (product: any) => void;
}

const ProductCard = ({ 
  product, 
  onMessageSeller, 
  isAdmin = false, 
  onDeleteProduct, 
  onBlockUser, 
  onUnblockUser, 
  isUserBlocked = false,
  onToggleWishlist,
  isInWishlist = false,
  onEditProduct
}: ProductProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Find the category data to get the proper name and icon
  const categoryData = categories.find(c => c.id === product.category);
  const categoryName = categoryData?.name || product.category;
  const categoryIcon = categoryData?.icon;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        {product.isUserProduct && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
            New Listing
          </Badge>
        )}
        {isUserBlocked && (
          <Badge className="absolute top-2 left-16 bg-destructive text-destructive-foreground">
            Blocked User
          </Badge>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {isAdmin && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="p-2 h-8 w-8">
                    <Trash2 size={14} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{product.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteProduct?.(product.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {product.seller && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={isUserBlocked ? "outline" : "destructive"} size="sm" className="p-2 h-8 w-8">
                      <Ban size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isUserBlocked ? "Unblock User" : "Block User"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {isUserBlocked 
                          ? `Are you sure you want to unblock user "${product.seller}"?`
                          : `Are you sure you want to block user "${product.seller}"? This will prevent them from listing new items.`
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => isUserBlocked 
                          ? onUnblockUser?.(product.seller!) 
                          : onBlockUser?.(product.seller!)
                        }
                      >
                        {isUserBlocked ? "Unblock" : "Block"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
          <button 
            onClick={() => onToggleWishlist?.(product.id)}
            className="bg-card p-2 rounded-full hover:bg-accent"
          >
            <Heart 
              size={16} 
              className={isInWishlist ? "text-destructive fill-destructive" : "text-muted-foreground"} 
            />
          </button>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{product.name}</CardTitle>
        
        {/* Enhanced category display */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center bg-muted px-3 py-1.5 rounded-full">
            {categoryIcon && React.cloneElement(categoryIcon, { 
              size: 16, 
              className: "text-primary mr-2" 
            })}
            <span className="body-small text-muted-foreground">
              {categoryName}
            </span>
          </div>
          
          {/* Price moved to the right for better balance */}
          <div className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground/30"} 
            />
          ))}
          <span className="ml-1 body-small text-muted-foreground">{product.rating}</span>
        </div>
        
        {product.description && showDetails && (
          <div className="mt-2">
            <h4 className="label-large">Description:</h4>
            <p className="body-small text-muted-foreground mt-1">{product.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex flex-col gap-2">
        {product.isUserProduct ? (
          <>
            <div className="flex gap-2 w-full">
              <Button 
                onClick={() => onMessageSeller(product.seller || "Seller")}
                className="flex-1 bg-bee-blue hover:bg-bee-blue/90"
              >
                <MessageCircle size={16} className="mr-2" />
                Message Seller
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onEditProduct?.(product)}
                className="px-3"
              >
                <Edit size={16} />
              </Button>
            </div>
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
