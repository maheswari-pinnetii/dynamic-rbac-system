import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatCurrency, formatNumber, getHumanStockStatus } from '../../utils/formatters';
import { DEMO_USERS, PERMISSIONS, ROLES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import productsApi from '../../api/productsApi';
import {
  Star,
  HeartHandshake,
  Smile,
  Heart,
  CheckCircle2,
  User,
  ShieldCheck,
  HelpingHand,
  Sparkles,
  Footprints,
  Users,
  Hand,
  UserMinus,
  Award,
  ChevronRight,
} from 'lucide-react';

export const ProductDetailModal = ({
  isOpen,
  onClose,
  product: initialProduct,
  onEdit = null,
  onDelete = null,
}) => {
  const { currentUser } = useAuth();
  const { hasPermission } = usePermission();

  const [product, setProduct] = useState(initialProduct);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'reviews'
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Sync state whenever initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setActiveImage(initialProduct.thumbnail || initialProduct.images?.[0] || '');
      setActiveTab('overview');

      // If product lacks detailed fields like reviews or dimensions and has a valid ID, fetch full product
      if (
        initialProduct.id &&
        !initialProduct.isCustom &&
        (!initialProduct.reviews || !initialProduct.dimensions)
      ) {
        setIsLoadingDetails(true);
        productsApi
          .getProductById(initialProduct.id)
          .then((detailedData) => {
            setProduct((prev) => ({ ...prev, ...detailedData }));
            if (!activeImage) {
              setActiveImage(detailedData.thumbnail || detailedData.images?.[0] || '');
            }
          })
          .catch((err) => {
            console.warn('Could not fetch extra product details:', err);
          })
          .finally(() => {
            setIsLoadingDetails(false);
          });
      }
    }
  }, [initialProduct]);

  if (!product) return null;

  const userRole = currentUser?.role || ROLES.EMPLOYEE;
  const canEdit = hasPermission(PERMISSIONS.EDIT_RECORDS, userRole);
  const canDelete = hasPermission(PERMISSIONS.DELETE_RECORDS, userRole);

  const stockStatus = getHumanStockStatus(product.stock);
  const curator = DEMO_USERS[(product.id || 1) % DEMO_USERS.length];

  // Price calculations
  const price = Number(product.price) || 0;
  const discount = Number(product.discountPercentage) || 0;
  const originalPrice = discount > 0 ? (price / (1 - discount / 100)).toFixed(2) : null;
  const savings = originalPrice ? (Number(originalPrice) - price).toFixed(2) : null;

  // Images list
  const allImages = Array.from(
    new Set([
      product.thumbnail,
      ...(Array.isArray(product.images) ? product.images : []),
    ].filter(Boolean))
  );

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Curated Product Overview"
      subtitle={`Item #${product.id} • ${product.category?.toUpperCase() || 'GENERAL'} • Managed in Central Catalog`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Product Hero: Interactive Gallery & Core Information */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Gallery Column */}
          <div className="w-full md:w-64 flex flex-col items-center flex-shrink-0">
            {/* Main Featured Image */}
            <div className="w-full h-56 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center p-3 shadow-xs relative group">
              <img
                src={
                  activeImage ||
                  product.thumbnail ||
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80'
                }
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {discount > 0 && (
                <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Carousel / Selector */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {allImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-11 h-11 rounded-xl border p-1 bg-white dark:bg-slate-800 flex-shrink-0 transition-all ${
                      activeImage === img
                        ? 'border-brand-500 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info Column */}
          <div className="flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="primary" size="sm">
                {product.category || 'General'}
              </Badge>
              {product.brand && (
                <Badge variant="default" size="sm">
                  Brand: {product.brand}
                </Badge>
              )}
              {product.isCustom ? (
                <Badge variant="purple" size="sm">
                  Colleague Custom Item
                </Badge>
              ) : (
                <Badge variant="blue" size="sm">
                  REST API Verified
                </Badge>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {product.title}
            </h2>

            {/* Price & Savings */}
            <div className="flex items-baseline gap-3 mt-2.5 flex-wrap">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(price)}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-semibold">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              {savings && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Save {formatCurrency(savings)}
                </span>
              )}
            </div>

            {/* Ratings & Customer Sentiment */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-slate-900 dark:text-slate-100">{product.rating || 4.5}</span>
                <span className="text-slate-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {reviews.length > 0 ? `${reviews.length} Verified Reviews` : 'Consistently Rated'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {product.description ||
                'High-grade catalog inventory curated and maintained by staff members across team divisions.'}
            </p>

            {/* Tags */}
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                <Smile className="w-3.5 h-3.5 text-slate-400" />
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation: Overview, Specifications & Policies, Customer Reviews */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Colleague Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Specifications & Logistics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Colleague Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Human Curator Attribution Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={curator.avatar}
                  alt={curator.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand-400 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Assigned Product Curator
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {curator.name} • {curator.title}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Primary Department: {curator.department}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Spec
              </span>
            </div>

            {/* Inventory Condition Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Units in Stock
                </span>
                <span
                  className={`text-base font-black ${
                    (product.stock || 0) > 10
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : (product.stock || 0) > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {product.stock || 0} units
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Supply Status
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1 truncate">
                  {stockStatus.label}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Catalog ID
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block mt-1">
                  #{product.id}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  SKU Identifier
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block mt-1 truncate">
                  {product.sku || `SKU-${product.id}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications & Logistics Tab */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Shipping Information */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
                  <HelpingHand className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Shipping & Delivery
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                    {product.shippingInformation || 'Standard priority ground shipping available'}
                  </p>
                </div>
              </div>

              {/* Warranty Coverage */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Warranty Coverage
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                    {product.warrantyInformation || 'Standard manufacturer warranty included'}
                  </p>
                </div>
              </div>

              {/* Return Policy */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Return Policy
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                    {product.returnPolicy || '30 days return window from delivery date'}
                  </p>
                </div>
              </div>

              {/* Package Dimensions & Weight */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Dimensions & Weight
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                    {product.dimensions
                      ? `${product.dimensions.width}W × ${product.dimensions.height}H × ${product.dimensions.depth}D cm`
                      : 'Standard catalog packaging'}{' '}
                    • {product.weight ? `${product.weight} kg` : 'Light parcel'}
                  </p>
                </div>
              </div>
            </div>

            {/* Minimum Order & Barcode Metadata */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Minimum Batch Order: <strong className="text-slate-800 dark:text-slate-200">{product.minimumOrderQuantity || 1} units</strong>
              </span>
              {product.meta?.barcode && (
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  Barcode: {product.meta.barcode}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Customer & Colleague Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Smile className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No written reviews recorded yet for this catalog item.
                </p>
              </div>
            ) : (
              reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[10px]">
                        {rev.reviewerName ? rev.reviewerName[0] : 'U'}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {rev.reviewerName || 'Anonymous Colleague'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s < (rev.rating || 5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 italic leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{rev.reviewerEmail}</span>
                    <span>
                      {rev.date
                        ? new Date(rev.date).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer Actions: Role Guarded Edit, Delete, and Done Reviewing */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <Button
                variant="outline"
                size="sm"
                icon={Hand}
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
              >
                Edit Product
              </Button>
            )}

            {canDelete && onDelete && (
              <Button
                variant="danger"
                size="sm"
                icon={UserMinus}
                onClick={() => {
                  onClose();
                  onDelete(product);
                }}
              >
                Remove Item
              </Button>
            )}
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Done Reviewing
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
