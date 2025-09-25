'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  createSkill, 
  listSkillItems, 
  updateSkillItem, 
  deleteSkillItem 
} from '@/lib/api';
import { useToast } from '@/components/Toast';
import Navigation from '@/components/Navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  TagIcon,
  LinkIcon,
  BookOpenIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface SkillItem {
  id: number;
  title: string;
  tags?: string[];
  type: string;
  url: string;
}

export default function AdminSkillsPage() {
  const router = useRouter();
  const { isAdminAuthenticated } = useAdminAuth();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skillItems, setSkillItems] = useState<SkillItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SkillItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    type: '',
    url: '',
  });

  // Check admin authentication
  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAdminAuthenticated, router]);

  // Load skill items on component mount
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadSkillItems();
    }
  }, [isAdminAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSkillItems = async () => {
    setIsLoading(true);
    try {
      console.log('Loading skill items...');
      const result = await listSkillItems({ index_start: 0, index_end: 100 });
      console.log('Skill items response:', result);
      setSkillItems(result);
    } catch (error) {
      console.error('Error loading skill items:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load skill items.';
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
        tags: tags,
        type: formData.type,
        url: formData.url,
      };

      console.log('Creating skill item:', requestData);
      const response = await createSkill(requestData);
      console.log('Create response:', response);

      showSuccessToast('Skill item created successfully!');
      setFormData({
        title: '',
        tags: '',
        type: '',
        url: '',
      });
      setShowAddForm(false);
      loadSkillItems();
    } catch (error) {
      console.error('Error creating skill item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create skill item.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = (item: SkillItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      tags: item.tags?.join(', ') || '',
      type: item.type,
      url: item.url,
    });
    setShowAddForm(true);
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
        tags: tags,
        type: formData.type,
        url: formData.url,
      };

      console.log('Updating skill item:', requestData);
      const response = await updateSkillItem(requestData);
      console.log('Update response:', response);

      showSuccessToast('Skill item updated successfully!');
      setFormData({
        title: '',
        tags: '',
        type: '',
        url: '',
      });
      setShowAddForm(false);
      setEditingItem(null);
      loadSkillItems();
    } catch (error) {
      console.error('Error updating skill item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update skill item.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill item?')) return;

    try {
      console.log('Deleting skill item:', id);
      const response = await deleteSkillItem({ id });
      console.log('Delete response:', response);

      showSuccessToast('Skill item deleted successfully!');
      loadSkillItems();
    } catch (error) {
      console.error('Error deleting skill item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete skill item.';
      showErrorToast(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      tags: '',
      type: '',
      url: '',
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
              Skill Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Manage skill catalog items with learning resources
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Skill Item' : 'Add New Skill Item'}
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
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., Python Programming"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Type *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="course">Course</option>
                    <option value="book">Book</option>
                    <option value="documentation">Documentation</option>
                    <option value="doc">Document</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="blog">Blog Post</option>
                    <option value="tool">Tool</option>
                    <option value="software">Software</option>
                    <option value="template">Template</option>
                    <option value="worksheet">Worksheet</option>
                    <option value="cheatsheet">Cheat Sheet</option>
                    <option value="guide">Guide</option>
                    <option value="reference">Reference</option>
                    <option value="podcast">Podcast</option>
                    <option value="webinar">Webinar</option>
                    <option value="certification">Certification</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL *
                </label>
                <input
                  type="url"
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="https://example.com/skill-resource"
                  required
                />
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
                  placeholder="python, programming, beginner"
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
              Add New Skill Item
            </button>
          </div>
        )}

        {/* Skill Items List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Skill Items ({skillItems.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading skill items...</p>
            </div>
          ) : skillItems.length === 0 ? (
            <div className="p-8 text-center">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No skill items found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {skillItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          <BookOpenIcon className="h-3 w-3 inline mr-1" />
                          {item.type}
                        </span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          View Resource
                        </a>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
                    <div className="flex gap-2 ml-4">
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
