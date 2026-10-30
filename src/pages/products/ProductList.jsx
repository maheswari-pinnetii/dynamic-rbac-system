import React, { useState } from 'react';
import {
  HeartHandshake,
  UserPlus,
  Eye,
  Hand,
  UserMinus,
  Sparkles,
  Star,
  Users,
  Smile,
  Crown,
  Heart,
} from 'lucide-react';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { useToast } from '../../context/ToastContext';
import { PERMISSIONS, ROLES, DEMO_USERS } from '../../utils/constants';
import { formatCurrency, formatNumber, getHumanStockStatus } from '../../utils/formatters';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import { TableSkeleton } from '../../components/common/Skeleton';
import CanAccess from '../../components/rbac/CanAccess';
import ProductDetailModal from './ProductDetailModal';
import ProductFormModal from './ProductFormModal';

export const ProductList = () => {
  const {
    products,
    allProducts,
    totalRecords,
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
  } = useProduct();

  const { currentUser } = useAuth();
  const { hasPermission } = usePermission();
  const { success, error: toastError } = useToast();

  const userRole = currentUser?.role || ROLES.EMPLOYEE;

  // Modals state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Permission queries for in-page status banner
  const canCreate = hasPermission(PERMISSIONS.CREATE_RECORDS, userRole);
  const canEdit = hasPermission(PERMISSIONS.EDIT_RECORDS, userRole);
  const canDelete = hasPermission(PERMISSIONS.DELETE_RECORDS, userRole);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormModalOpen(true);
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        success(`"${payload.title}" details updated successfully by ${currentUser.name}!`, 'Record Updated');
      } else {
        await createProduct(payload);
        success(`"${payload.title}" added to the team catalog by ${currentUser.name}!`, 'Product Added');
      }
      setFormModalOpen(false);
    } catch (err) {
      toastError(err.message || 'Could not save record to REST API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id, productToDelete.title);
      success(`"${productToDelete.title}" removed from catalog.`, 'Item Removed');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      toastError(err.message || 'Failed to remove item.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Curated Product Catalog"
        subtitle="Browse, search, and manage products overseen by our colleagues across departments."
        badge={`${totalRecords} Products Curated`}
        badgeVariant="primary"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={HeartHandshake}
              onClick={fetchProducts}
              isLoading={loading}
              title="Refresh records from catalog"
            >
              Refresh Catalog
            </Button>

            {/* Feature-Level RBAC: Create Records Button */}
            <CanAccess
              permission={PERMISSIONS.CREATE_RECORDS}
              fallback={
                <div
                  className="text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-1.5"
                  title="Your role does not currently have permission to add new products."
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Adding Restricted</span>
                </div>
              }
            >
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={handleOpenCreate}
              >
                Add New Product
              </Button>
            </CanAccess>
          </div>
        }
      />

      {/* Human Permission Status Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Active Privileges for {currentUser?.name} ({userRole}):
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 border ${
              canCreate
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            Can Add Items: {canCreate ? 'Yes (Granted)' : 'No (Restricted)'}
          </span>
          <span
            className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 border ${
              canEdit
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            Can Edit Items: {canEdit ? 'Yes (Granted)' : 'No (Restricted)'}
          </span>
          <span
            className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 border ${
              canDelete
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            Can Remove Items: {canDelete ? 'Yes (Granted)' : 'No (Restricted)'}
          </span>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Live Search */}
          <div className="relative">
            <Eye className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, brand, or colleague..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="all">All Departments / Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Health Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="all">All Supply Conditions</option>
              <option value="in_stock">Abundant Stock (&gt;10 units)</option>
              <option value="low_stock">Low Stock (1-10 units)</option>
              <option value="out_of_stock">Empty (Needs restock)</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="id">Catalog Index (ID)</option>
              <option value="title">Product Name</option>
              <option value="price">Retail Price</option>
              <option value="stock">Quantity on Hand</option>
              <option value="rating">Customer Rating</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : error ? (
          <div className="p-12 text-center">
            <Smile className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Could not retrieve catalog records</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
            <Button variant="primary" size="sm" onClick={fetchProducts} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Smile className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No products match your search</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try searching with a different word or clearing your filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="mt-4"
            >
              Show All Products
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item & Curator</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Supply Condition</th>
                  <th className="py-3 px-4">Satisfaction</th>
                  <th className="py-3 px-4 text-right">Actions (Role Guarded)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {products.map((item, index) => {
                  const stockStatus = getHumanStockStatus(item.stock);
                  // Assign human colleague attribution
                  const curator = DEMO_USERS[index % DEMO_USERS.length];

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenDetail(item)}
                      className="cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors group"
                      title="Click to view full product information, specifications, and reviews"
                    >
                      {/* Product Name & Human Curator */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.thumbnail ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'
                            }
                            alt={item.title}
                            className="w-11 h-11 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex-shrink-0 group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate text-xs transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                                <img
                                  src={curator.avatar}
                                  alt={curator.name}
                                  className="w-3.5 h-3.5 rounded-full object-cover"
                                />
                                Curated by {curator.name.split(' ')[0]}
                              </span>
                              {item.isCustom && (
                                <span className="text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded-full border border-purple-200 dark:border-purple-800 font-bold">
                                  User Added
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <Badge variant="primary" size="sm">
                          {item.category || 'General'}
                        </Badge>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(item.price)}
                        </div>
                        {item.discountPercentage ? (
                          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                            {item.discountPercentage}% off retail
                          </div>
                        ) : null}
                      </td>

                      {/* Human Supply Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${stockStatus.badgeClass}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
                          {stockStatus.label}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating || 4.5}</span>
                          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-normal">/ 5</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(item);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Inspect product details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Action */}
                          <CanAccess
                            permission={PERMISSIONS.EDIT_RECORDS}
                            fallback={null}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(item);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit product information"
                            >
                              <Hand className="w-4 h-4" />
                            </button>
                          </CanAccess>

                          {/* Delete Action */}
                          <CanAccess
                            permission={PERMISSIONS.DELETE_RECORDS}
                            fallback={null}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(item);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Permanently remove product"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </CanAccess>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Product Details Modal */}
      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct}
        onEdit={canEdit ? handleOpenEdit : null}
        onDelete={canDelete ? handleOpenDelete : null}
      />

      {/* Create / Edit Form Modal */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove this item from catalog?"
        message={`Are you sure you want to remove "${productToDelete?.title}"? This permanently updates the central inventory for all colleagues.`}
        confirmText="Yes, Remove Item"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default ProductList;
