import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, Shield, Grid3x3, List } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { ImageWithFallback } from "./common/ImageWithFallback";
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

interface ProductListingProps {
  onNavigate: (page: string, productId?: number | string) => void;
  selectedCategory?: string;
}

export function ProductListing({ onNavigate, selectedCategory }: ProductListingProps) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filters: any = {};
        if (selectedCategory) {
          filters.category = selectedCategory;
        }
        const response = await productAPI.getAll(filters);
        if (response.success) {
          setProducts(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats.map(cat => ({
      name: cat,
      slug: cat.toLowerCase().replace(/\s+/g, '-'),
      count: products.filter(p => p.category === cat).length
    }));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategories, priceRange, minRating, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      quantity: 1
    };
    addToCart(cartProduct, 1);
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice) return null;
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return `${discount}% OFF`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4">Shop All Products</h1>
          <p className="text-gray-600">
            Discover {filteredProducts.length} products with blockchain-verified reviews
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <List className="h-5 w-5" />
              ) : (
                <Grid3x3 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0 hidden lg:block">
              <Card className="p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Filters</h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.slug} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.slug}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={() => handleCategoryToggle(category.name)}
                        />
                        <Label
                          htmlFor={category.slug}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category.name} ({category.count})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <Slider
                    min={0}
                    max={200000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>NPR {priceRange[0].toLocaleString()}</span>
                    <span>NPR {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                        className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100 ${
                          minRating === rating ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 200000]);
                    setMinRating(0);
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </Button>
              </Card>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 200000]);
                    setMinRating(0);
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map(product => (
                  <Card
                    key={product._id || product.id}
                    className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                    onClick={() => onNavigate('product', product._id || product.id)}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'rounded-t-lg'}`}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === 'list' ? 'w-48 h-full' : 'w-full h-64'
                        }`}
                      />
                      {product.originalPrice && (
                        <Badge className="absolute top-4 left-4 bg-[#FF6600] text-white">
                          {calculateDiscount(product.price, product.originalPrice)}
                        </Badge>
                      )}
                      {product.tags?.includes('bestseller') && (
                        <Badge className="absolute top-4 right-4 bg-[#003366] text-white">
                          Bestseller
                        </Badge>
                      )}
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold group-hover:text-[#003366] line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({product.reviews} reviews)
                        </span>
                      </div>

                      {viewMode === 'list' && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="font-bold text-[#003366]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-[#00CC99]" />
                          <span className="text-sm text-[#00CC99] font-medium">
                            {product.verifiedReviews} Verified
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-[#003366] hover:bg-[#002244] text-white"
                          onClick={() => onNavigate('product', product._id || product.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600] hover:text-white"
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
