import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Edit2, Trash2, Search, X, Check, UploadCloud } from 'lucide-react';
import { Database } from '../../utils/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  shipping_price: number;
  packing_price: number;
  free_packing_pincodes: string[];
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: 'meat',
  image_url: '',
  is_featured: false,
   shipping_price: 0,
  packing_price: 0,
  free_packing_pincodes: [],
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ProductFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePlaceholder, setImagePlaceholder] = useState('https://placehold.co/300x300');
  const [currPincode, setCurrPincode] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Manage Products | Admin Dashboard';
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    if (formErrors[name as keyof ProductFormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    // at top of validateForm()

    
const name = formData.name?.trim() ?? ''
const desc = formData.description?.trim() ?? ''
//const img  = formData.image_url?.trim() ?? ''
const dec = formData.description?.trim() ?? ''
let isValid = true
const errors: Partial<ProductFormData> = {}

if (!name) {
  errors.name = 'Product name is required'
  isValid = false
}

if (!desc) {
  errors.description = 'Product description is required'
  isValid = false
}

if(!dec){
  errors.description = 'Product description is required'
  isValid = false
}


    setFormErrors(errors);
    return isValid;
  };


// ===== after validateForm =====

 // --- NEW: upload file to Supabase Storage & set image_url ---
 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;
   const fileExt = file.name.split('.').pop();
   const fileName = `${Math.random().toString(36).substr(2, 8)}.${fileExt}`;
   const filePath = `uploads/${fileName}`;
   try {
     showToast('Uploading image...', 'info');
     const { error: uploadError } = await supabase.storage
       .from('product-images')
       .upload(`uploads/${fileName}`,   // file path within bucket
          file,                    // the File object
          { upsert: true }         // allow overwrite if same path
  );
     if (uploadError) throw uploadError;

     const { data, error: urlError } = supabase
       .storage
       .from('product-images')
       .getPublicUrl(filePath);
     if (urlError) throw urlError;
     const publicURL = data.publicUrl;
     setFormData(prev => ({ ...prev, image_url: publicURL }));
     setImagePlaceholder(publicURL);
     showToast('Image uploaded!', 'success');
   } catch (err: any) {
     console.error('Upload error:', err);
     showToast('Image upload failed', 'error');
   }
 };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image_url: formData.image_url,
        is_featured: formData.is_featured,
        shipping_price: formData.shipping_price,
        packing_price: formData.packing_price,
        free_packing_pincodes: formData.free_packing_pincodes,
      };
      
      if (isEditing && formData.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', formData.id);

        if (error) throw error;
        
        showToast('Product updated successfully', 'success');
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert(payload);

        if (error) throw error;
        
        showToast('Product added successfully', 'success');
      }
      
      // Reset form and refresh products
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Failed to save product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editProduct = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      is_featured: product.is_featured,
      shipping_price: product.shipping_price,
      packing_price: product.packing_price,
      free_packing_pincodes: product.free_packing_pincodes,
    });
    setImagePlaceholder(product.image_url);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setIsEditing(false);
    setShowForm(false);
    setImagePlaceholder('https://placehold.co/300x300');
    setCurrPincode('');
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add New Product
          </button>
        )}
      </div>
      
      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Form Fields */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name ?? ''}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring focus:ring-primary-200 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description ?? ''}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring focus:ring-primary-200 ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price ?? ''}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md focus:ring focus:ring-primary-200 ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.price ?? ''}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category ?? ''} 
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md focus:ring focus:ring-primary-200 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="meat">Meat</option>
                    <option value="chicken">Chicken</option>
                    <option value="mutton">Mutton</option>
                    <option value="seafood">Seafood</option>
                    <option value="pickle">Pickle</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="image_url" className="block text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url ?? ''}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePlaceholder(e.target.value || 'https://placehold.co/300x300');
                  }}
                  className={`w-full p-3 border rounded-md focus:ring focus:ring-primary-200 ${
                    formErrors.image_url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {formErrors.image_url && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.image_url}</p>
                )}

               <label className="inline-flex items-center px-4 py-2 bg-gray-100 border rounded-md cursor-pointer hover:bg-gray-200">
               <UploadCloud size={18} className="mr-2" />
                <span>Upload</span>
                <input
             type="file"
           accept="image/*"
       className="hidden"
       onChange={handleFileChange}
    />
  </label>

              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => 
                    setFormData((prev) => ({
                      ...prev,
                      is_featured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_featured" className="ml-2 text-gray-700">
                  Featured Product
                </label>
              </div>
            </div>

            <div>
                <label htmlFor="shipping_price" className="block text-gray-700 mb-2">Shipping Price (₹)</label>
                <input
                  type="number"
                  id="shipping_price"
                  name="shipping_price"
                  step="0.01"
                  min="0"
                  value={formData.shipping_price}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-primary-200 border-gray-300"
                  placeholder="0.00"
                />
              </div>

              {/* Packing Price */}
              <div>
                <label htmlFor="packing_price" className="block text-gray-700 mb-2">Packing Price (₹)</label>
                <input
                  type="number"
                  id="packing_price"
                  name="packing_price"
                  step="0.01"
                  min="0"
                  value={formData.packing_price}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-primary-200 border-gray-300"
                  placeholder="0.00"
                />
              </div>

              {/* Free Packing Pincodes */}
              <div>
                <label className="block text-gray-700 mb-2">Free Packing (Pincodes)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currPincode}
                    onChange={e => setCurrPincode(e.target.value)}
                    placeholder="Enter pincode"
                    className="flex-1 p-2 border rounded-md border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (currPincode && !formData.free_packing_pincodes.includes(currPincode)) {
                        setFormData(prev => ({
                          ...prev,
                          free_packing_pincodes: [...prev.free_packing_pincodes, currPincode]
                        }));
                        setCurrPincode('');
                      }
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >Add</button>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.free_packing_pincodes.map(pin => (
                    <li key={pin} className="flex justify-between items-center">
                      <span>{pin}</span>
                      <button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        free_packing_pincodes: prev.free_packing_pincodes.filter(p => p !== pin)
                      }))} className="text-red-500">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>

            
            {/* Right Column - Image Preview */}
            <div className="flex flex-col items-center">
              <div className="border rounded-md p-2 mb-4">
                <img
                  src={imagePlaceholder}
                  alt="Product Preview"
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/300x300';
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Image Preview
              </p>
            </div>
            
            {/* Submit Buttons */}
            <div className="md:col-span-3 flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-white transition ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check size={18} className="mr-2" />
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold mb-4 sm:mb-0">All Products</h2>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-6 animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.image_url || 'https://placehold.co/50'}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/50';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.is_featured ? (
                        <span className="text-green-500">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => editProduct(product)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;