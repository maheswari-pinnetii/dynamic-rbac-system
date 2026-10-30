import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Heart, Award, CheckCircle2 } from 'lucide-react';

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
}) => {
  const isEditing = Boolean(initialData);
  const { error } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    rating: '4.5',
    discountPercentage: '10',
    description: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || (categories[0] || 'beauty'),
        price: initialData.price ? String(initialData.price) : '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        brand: initialData.brand || '',
        rating: initialData.rating ? String(initialData.rating) : '4.5',
        discountPercentage: initialData.discountPercentage
          ? String(initialData.discountPercentage)
          : '10',
        description: initialData.description || '',
        thumbnail: initialData.thumbnail || '',
      });
    } else {
      setFormData({
        title: '',
        category: categories[0] || 'smartphones',
        price: '',
        stock: '25',
        brand: '',
        rating: '4.5',
        discountPercentage: '12',
        description: '',
        thumbnail: '',
      });
    }
    setErrors({});
  }, [initialData, categories, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Product title is required';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }

    if (!formData.price) {
      errs.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errs.price = 'Price must be a positive number';
    }

    if (formData.stock === '' || formData.stock === undefined) {
      errs.stock = 'Stock count is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      errs.stock = 'Stock must be 0 or greater';
    }

    if (!formData.category) {
      errs.category = 'Category is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      brand: formData.brand.trim() || 'Enterprise Brand',
      rating: parseFloat(formData.rating) || 4.5,
      discountPercentage: parseFloat(formData.discountPercentage) || 0,
      description:
        formData.description.trim() ||
        `${formData.title.trim()} - Premium quality item managed via Dynamic RBAC system.`,
      thumbnail:
        formData.thumbnail.trim() ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      error(err.message || 'Operation failed. Please verify API connection.');
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat,
    label: cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product Record' : 'Create New Product Record'}
      subtitle={
        isEditing
          ? `Dispatches HTTP PUT /products/${initialData.id}`
          : 'Dispatches HTTP POST /products/add to REST API'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Product Title *"
          name="title"
          placeholder="e.g. Ultra Wireless Noise Canceling Headphones"
          icon={Sparkles}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category *"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categoryOptions}
            error={errors.category}
            required
          />

          <Input
            label="Brand Name"
            name="brand"
            placeholder="e.g. Sony, Apple, Bose"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Price (USD) *"
            name="price"
            type="number"
            step="0.01"
            placeholder="299.99"
            icon={Award}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={errors.price}
            required
          />

          <Input
            label="Inventory Stock *"
            name="stock"
            type="number"
            placeholder="50"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            error={errors.stock}
            required
          />

          <Input
            label="Discount %"
            name="discountPercentage"
            type="number"
            step="0.5"
            placeholder="15"
            value={formData.discountPercentage}
            onChange={(e) =>
              setFormData({ ...formData, discountPercentage: e.target.value })
            }
          />
        </div>

        <Input
          label="Thumbnail Image URL"
          name="thumbnail"
          placeholder="https://images.unsplash.com/photo-..."
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          helperText="Leave blank for an automatic high-resolution placeholder"
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed product specifications and highlights..."
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm py-2 px-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* REST API Payload Preview Indicator */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <span className="font-mono text-[11px]">
            Payload: {isEditing ? `PUT /products/${initialData?.id}` : 'POST /products/add'}
          </span>
          <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-400">
            Validated Schema
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            icon={CheckCircle2}
          >
            {isEditing ? 'Save Changes' : 'Create Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;

