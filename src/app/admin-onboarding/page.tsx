'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  createOnboardItem, 
  listOnboardItems, 
  updateOnboardItem, 
  deleteOnboardItem,
  getOnboardItem
} from '@/lib/api';
import { useToast } from '@/components/Toast';
import Navigation from '@/components/Navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  TagIcon,
  CheckCircleIcon,
  LinkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface OnboardItem {
  id: number;
  title: string;
  specialization: string;
  tags?: string[];
  checklist?: string[];
  resources?: string[];
}

export default function AdminOnboardingPage() {
  const router = useRouter();
  const { isAdminAuthenticated } = useAdminAuth();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [onboardItems, setOnboardItems] = useState<OnboardItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<OnboardItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    specialization: '',
    tags: '',
  });

  // Check admin authentication
  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAdminAuthenticated, router]);

  // Load onboard items on component mount
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadOnboardItems();
    }
  }, [isAdminAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOnboardItems = async () => {
    setIsLoading(true);
    try {
      console.log('Loading onboard items...');
      const result = await listOnboardItems({ index_start: 0, index_end: 100 });
      console.log('Onboard items response:', result);
      setOnboardItems(result);
    } catch (error) {
      console.error('Error loading onboard items:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load onboard items.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const requestData = {
        title: formData.title,
        specialization: formData.specialization,
        tags: tags,
        checklist: [],
        resources: [],
      };

      console.log('Creating onboard item:', requestData);
      const response = await createOnboardItem(requestData);
      console.log('Create response:', response);

      showSuccessToast('Onboarding item created successfully!');
      setFormData({
        title: '',
        specialization: '',
        tags: '',
      });
      setShowAddForm(false);
      loadOnboardItems();
    } catch (error) {
      console.error('Error creating onboard item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create onboard item.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = async (item: OnboardItem) => {
    setIsLoading(true);
    try {
      // Fetch the full details of the onboarding item
      console.log('Fetching onboarding item details for ID:', item.id);
      const fullItemDetails = await getOnboardItem({ id: item.id });
      console.log('Fetched item details:', fullItemDetails);
      
      setEditingItem(fullItemDetails);
      setFormData({
        title: fullItemDetails.title,
        specialization: fullItemDetails.specialization,
        tags: fullItemDetails.tags?.join(', ') || '',
      });
      setShowAddForm(true);
    } catch (error) {
      console.error('Error fetching onboarding item details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch onboarding item details.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsLoading(true);

    try {
      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const requestData = {
        id: editingItem.id,
        title: formData.title,
        specialization: formData.specialization,
        tags: tags,
        checklist: [],
        resources: [],
      };

      console.log('Updating onboard item:', requestData);
      const response = await updateOnboardItem(requestData);
      console.log('Update response:', response);

      showSuccessToast('Onboarding item updated successfully!');
      setFormData({
        title: '',
        specialization: '',
        tags: '',
      });
      setShowAddForm(false);
      setEditingItem(null);
      loadOnboardItems();
    } catch (error) {
      console.error('Error updating onboard item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update onboard item.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this onboarding item?')) return;

    try {
      console.log('Deleting onboard item:', id);
      const response = await deleteOnboardItem({ id });
      console.log('Delete response:', response);

      showSuccessToast('Onboarding item deleted successfully!');
      loadOnboardItems();
    } catch (error) {
      console.error('Error deleting onboard item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete onboard item.';
      showErrorToast(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      specialization: '',
      tags: '',
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/admin')}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Admin
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-4">
              Onboarding Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Manage onboarding catalogs for different job roles
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Onboarding Item' : 'Add New Onboarding Item'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., Backend"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="python, django, api"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Onboarding Item
            </button>
          </div>
        )}

        {/* Onboard Items List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Onboarding Items ({onboardItems.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading onboarding items...</p>
            </div>
          ) : onboardItems.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No onboarding items found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {onboardItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                        {item.specialization}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              <TagIcon className="h-3 w-3 inline mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
