import apiClient from './axiosClient';

export const productsApi = {
  /**
   * Fetch paginated list of products with optional search and sort
   */
  getProducts: async ({ limit = 10, skip = 0, sortBy = '', order = 'asc' } = {}) => {
    let url = `/products?limit=${limit}&skip=${skip}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}&order=${order}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Search products by keyword
   */
  searchProducts: async (query, { limit = 10, skip = 0 } = {}) => {
    const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    return response.data;
  },

  /**
   * Fetch products by category
   */
  getProductsByCategory: async (category, { limit = 10, skip = 0 } = {}) => {
    const response = await apiClient.get(`/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  /**
   * Fetch all category names
   */
  getCategories: async () => {
    const response = await apiClient.get('/products/categories');
    // DummyJSON returns array of strings or objects {slug, name, url}
    return response.data.map((cat) => (typeof cat === 'object' ? cat.slug || cat.name : cat));
  },

  /**
   * Fetch a single product by ID
   */
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product (POST)
   */
  createProduct: async (productData) => {
    const response = await apiClient.post('/products/add', productData);
    return response.data;
  },

  /**
   * Update an existing product (PUT / PATCH)
   */
  updateProduct: async (id, updatedFields) => {
    const response = await apiClient.put(`/products/${id}`, updatedFields);
    return response.data;
  },

  /**
   * Delete a product (DELETE)
   */
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

export default productsApi;

