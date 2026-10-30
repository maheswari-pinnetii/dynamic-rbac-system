import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import productsApi from '../api/productsApi';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { usePermission } from './PermissionContext';
import { useAuth } from './AuthContext';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const { logActivity } = usePermission();
  const { currentUser } = useAuth();

  // Local overrides (created, updated, deleted products that survive page refresh)
  const [localStore, setLocalStore] = useState(() => {
    return storage.get(STORAGE_KEYS.PRODUCTS_OVERRIDE, {
      customCreated: [],
      updatedMap: {},
      deletedIds: [],
    });
  });

  // State for fetched products
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalApiRecords, setTotalApiRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination, Search, Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [sortBy, setSortBy] = useState('id'); // 'id' | 'title' | 'price' | 'rating' | 'stock'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Persist local store
  useEffect(() => {
    storage.set(STORAGE_KEYS.PRODUCTS_OVERRIDE, localStore);
  }, [localStore]);

  // Load categories once
  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const catList = await productsApi.getCategories();
        if (isMounted) setCategories(catList);
      } catch (err) {
        console.warn('Could not load categories from remote API, using defaults:', err);
        if (isMounted) {
          setCategories([
            'beauty',
            'fragrances',
            'furniture',
            'groceries',
            'home-decoration',
            'kitchen-accessories',
            'laptops',
            'mens-shirts',
            'mens-shoes',
            'mens-watches',
            'mobile-accessories',
            'motorcycle',
            'skin-care',
            'smartphones',
            'sports-accessories',
            'sunglasses',
            'tablets',
            'tops',
            'vehicle',
            'womens-bags',
            'womens-dresses',
            'womens-jewellery',
            'womens-shoes',
            'womens-watches',
          ]);
        }
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      // If searching, use search endpoint
      if (searchTerm.trim()) {
        data = await productsApi.searchProducts(searchTerm.trim(), {
          limit: 100, // Fetch broader sample to enable rich client filtering
          skip: 0,
        });
      } else if (selectedCategory && selectedCategory !== 'all') {
        data = await productsApi.getProductsByCategory(selectedCategory, {
          limit: 100,
          skip: 0,
        });
      } else {
        data = await productsApi.getProducts({
          limit: 100,
          skip: 0,
        });
      }

      setProducts(data.products || []);
      setTotalApiRecords(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Failed to fetch products from Third-Party REST API.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Combine remote products with locally created, updated, and deleted products
  const combinedProducts = useMemo(() => {
    // 1. Filter out deleted
    const deletedSet = new Set(localStore.deletedIds);
    let list = products.filter((p) => !deletedSet.has(p.id));

    // 2. Apply updates
    list = list.map((p) => {
      if (localStore.updatedMap[p.id]) {
        return { ...p, ...localStore.updatedMap[p.id] };
      }
      return p;
    });

    // 3. Prepend custom created items (that are not deleted)
    const validCustom = localStore.customCreated.filter((p) => !deletedSet.has(p.id));
    const allItems = [...validCustom, ...list];

    // 4. Client-side filter by status if applied
    let filtered = allItems;
    if (selectedStatus === 'in_stock') {
      filtered = filtered.filter((p) => (p.stock || 0) > 10);
    } else if (selectedStatus === 'low_stock') {
      filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
    } else if (selectedStatus === 'out_of_stock') {
      filtered = filtered.filter((p) => (p.stock || 0) === 0);
    }

    // 5. Client-side sorting
    filtered = [...filtered].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return filtered;
  }, [products, localStore, selectedStatus, sortBy, sortOrder]);

  // Paginated slice for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return combinedProducts.slice(startIndex, startIndex + pageSize);
  }, [combinedProducts, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(combinedProducts.length / pageSize));

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, pageSize]);

  /**
   * CREATE Product (POST /products/add)
   */
  const createProduct = useCallback(
    async (productData) => {
      try {
        // Execute real Third-Party API call
        const apiResponse = await productsApi.createProduct(productData);

        // Build fully formed record with simulated ID & default image
        const newRecord = {
          ...productData,
          id: apiResponse.id || Date.now(),
          price: parseFloat(productData.price) || 0,
          stock: parseInt(productData.stock, 10) || 0,
          rating: parseFloat(productData.rating) || 4.5,
          thumbnail:
            productData.thumbnail ||
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
          images: [
            productData.thumbnail ||
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          ],
          createdAt: new Date().toISOString(),
          isCustom: true,
        };

        // Update local store
        setLocalStore((prev) => ({
          ...prev,
          customCreated: [newRecord, ...prev.customCreated],
        }));

        logActivity(
          'Product Created',
          `Created product "${newRecord.title}" (ID: ${newRecord.id}) in ${newRecord.category}.`,
          currentUser,
          'crud'
        );

        return newRecord;
      } catch (err) {
        console.error('Create product failed:', err);
        throw err;
      }
    },
    [currentUser, logActivity]
  );

  /**
   * EDIT Product (PUT /products/{id})
   */
  const updateProduct = useCallback(
    async (id, updatedFields) => {
      try {
        // Call remote API for realism
        try {
          await productsApi.updateProduct(id, updatedFields);
        } catch (apiErr) {
          // If it's a locally generated ID, remote API will 404, which is expected
          console.warn('Remote update warning (expected for client-created IDs):', apiErr.message);
        }

        // Store update locally
        setLocalStore((prev) => {
          // If in customCreated, update it there directly
          const inCustom = prev.customCreated.some((p) => p.id === id);
          if (inCustom) {
            return {
              ...prev,
              customCreated: prev.customCreated.map((p) =>
                p.id === id ? { ...p, ...updatedFields } : p
              ),
            };
          }
          // Otherwise store in updatedMap
          return {
            ...prev,
            updatedMap: {
              ...prev.updatedMap,
              [id]: { ...(prev.updatedMap[id] || {}), ...updatedFields },
            },
          };
        });

        logActivity(
          'Product Updated',
          `Updated record details for Product ID #${id}.`,
          currentUser,
          'crud'
        );

        return true;
      } catch (err) {
        console.error('Update product failed:', err);
        throw err;
      }
    },
    [currentUser, logActivity]
  );

  /**
   * DELETE Product (DELETE /products/{id})
   */
  const deleteProduct = useCallback(
    async (id, productTitle = '') => {
      try {
        try {
          await productsApi.deleteProduct(id);
        } catch (apiErr) {
          console.warn('Remote delete warning:', apiErr.message);
        }

        setLocalStore((prev) => ({
          ...prev,
          deletedIds: [...new Set([...prev.deletedIds, id])],
          customCreated: prev.customCreated.filter((p) => p.id !== id),
        }));

        logActivity(
          'Product Deleted',
          `Removed product "${productTitle || `#${id}`}" from inventory.`,
          currentUser,
          'crud'
        );

        return true;
      } catch (err) {
        console.error('Delete product failed:', err);
        throw err;
      }
    },
    [currentUser, logActivity]
  );

  /**
   * Analytics Aggregations for Module 2
   */
  const analyticsData = useMemo(() => {
    const list = combinedProducts;
    const total = list.length;
    const active = list.filter((p) => (p.stock || 0) > 0).length;
    const inactive = list.filter((p) => (p.stock || 0) === 0).length;
    const lowStock = list.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;

    // Category distribution
    const categoryCounts = {};
    list.forEach((p) => {
      const cat = p.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name: name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        count,
        percentage: total ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Status distribution for Donut / Pie Chart
    const statusDistribution = [
      { name: 'In Stock (>10 units)', value: active - lowStock, color: '#10b981' },
      { name: 'Low Stock (1-10 units)', value: lowStock, color: '#f59e0b' },
      { name: 'Out of Stock (0 units)', value: inactive, color: '#ef4444' },
    ];

    // Category distribution for Bar Chart
    const categoryBarData = topCategories.map((cat, idx) => ({
      name: cat.name.length > 12 ? cat.name.substring(0, 10) + '..' : cat.name,
      fullName: cat.name,
      count: cat.count,
      value: cat.count * 12, // simulated volume
    }));

    // Monthly Growth Line Chart
    const monthlyGrowth = [
      { month: 'Nov', records: Math.max(10, total - 45), active: Math.max(8, active - 40), target: 60 },
      { month: 'Dec', records: Math.max(25, total - 35), active: Math.max(20, active - 30), target: 75 },
      { month: 'Jan', records: Math.max(40, total - 22), active: Math.max(35, active - 20), target: 90 },
      { month: 'Feb', records: Math.max(65, total - 12), active: Math.max(55, active - 10), target: 110 },
      { month: 'Mar', records: Math.max(80, total - 5), active: Math.max(70, active - 5), target: 130 },
      { month: 'Apr', records: total, active: active, target: 150 },
    ];

    // Activity Trend Line Chart
    const activityTrend = [
      { day: 'Mon', reads: 140, writes: 18, updates: 12 },
      { day: 'Tue', reads: 220, writes: 32, updates: 24 },
      { day: 'Wed', reads: 280, writes: 45, updates: 30 },
      { day: 'Thu', reads: 260, writes: 28, updates: 19 },
      { day: 'Fri', reads: 340, writes: 54, updates: 42 },
      { day: 'Sat', reads: 180, writes: 14, updates: 8 },
      { day: 'Sun', reads: 120, writes: 8, updates: 5 },
    ];

    return {
      total,
      active,
      inactive,
      lowStock,
      topCategories,
      statusDistribution,
      categoryBarData,
      monthlyGrowth,
      activityTrend,
    };
  }, [combinedProducts]);

  return (
    <ProductContext.Provider
      value={{
        products: paginatedProducts,
        allProducts: combinedProducts,
        totalRecords: combinedProducts.length,
        loading,
        error,
        categories,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalPages,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        analyticsData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;

