"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setAllProducts(data);
        setProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setProducts(filtered);
  }, [searchQuery, priceRange, sortBy, allProducts]);

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="mb-4 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Narrow down your product search
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 300]}
                      max={300}
                      step={10}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    />
                    <div className="flex justify-between">
                      <span>{priceRange[0]} DZD</span>
                      <span>{priceRange[1]} DZD</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    setPriceRange([0, 300]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        <div className="hidden sm:block w-full md:w-64 space-y-8">
          <div className="p-4 border rounded-lg space-y-6">

            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  defaultValue={[0, 300]}
                  max={300}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                />
                <div className="flex justify-between">
                  <span>{priceRange[0]} DZD</span>
                  <span>{priceRange[1]} DZD</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setPriceRange([0, 300]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-4">No products found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    
                  </div>
                  <CardContent className="pt-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium line-clamp-1">{product.title}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <span className="font-bold">{product.price.toFixed(2)} DZD</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}