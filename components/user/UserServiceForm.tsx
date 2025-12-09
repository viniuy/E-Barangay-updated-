'use client'

import { useState, useEffect } from "react";
import { getItemById } from "@/lib/api/items";
import { createRequest } from "@/lib/api/requests";
import { ItemWithCategory } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";

interface ServiceFormProps {
  service: string | null; 
  onNavigate: (view: 'dashboard' | 'services' | 'facilities' | 'application' | 'requests') => void;
}

export function ServiceForm({ service, onNavigate }: ServiceFormProps) {
  const [item, setItem] = useState<ItemWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadItem() {
      if (!service) {
        setLoading(false);
        return;
      }

      try {
        const itemData = await getItemById(service);
        setItem(itemData);
      } catch (error) {
        console.error('Failed to load item:', error);
      } finally {
        setLoading(false);
      }
    }

    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }

    loadItem();
    loadUser();
  }, [service]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) {
      alert("Service not found");
      return;
    }
    if (!userId) {
      alert("Please log in to submit a request");
      return;
    }

    try {
      setSubmitting(true);
      const reason = Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      await createRequest(userId, item.id, reason);
      alert("Application submitted successfully!");
      onNavigate('services');
    } catch (error) {
      console.error('Failed to submit request:', error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Service not found.</div>
      </div>
    );
  }

  // Parse booking rules or requirements from the item
  const bookingRules = (item as any).bookingRules || (item as any).booking_rules
  const requirements = bookingRules
    ? bookingRules.split(',').map((r: string) => r.trim()).filter(Boolean)
    : ['Name', 'Contact Number', 'Purpose'];

<<<<<<< HEAD
          <div className="space-y-3">
            {Object.entries(formValues).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-semibold">{key}:</span>
                <span className="text-gray-700">{value as string}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="flex-1"
            >
               Back to Edit
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Confirm & Submit'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main Form View
=======
>>>>>>> 433db316584fbc57538fb7ee5df35c6362c61f63
  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow m-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {item.name} Application
      </h2>

      {item.description && (
        <p className="text-gray-600 mb-4">{item.description}</p>
      )}

<<<<<<< HEAD
          {submitStatus === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Dynamic Form Fields */}
          {requirements.map((req: string, idx: number) => {
            const isTextArea = req.toLowerCase().includes('address') || 
                              req.toLowerCase().includes('purpose') ||
                              req.toLowerCase().includes('reason');
            
            return (
              <div key={idx} className="space-y-2">
                <Label htmlFor={req}>
                  {req} <span className="text-red-500">*</span>
                </Label>
                {isTextArea ? (
                  <Textarea
                    id={req}
                    {...register(req, getValidationRules(req))}
                    placeholder={`Enter ${req}`}
                    rows={3}
                    className={errors[req] ? 'border-red-500' : ''}
                  />
                ) : (
                  <Input
                    id={req}
                    {...register(req, getValidationRules(req))}
                    placeholder={`Enter ${req}`}
                    className={errors[req] ? 'border-red-500' : ''}
                  />
                )}
                {errors[req] && (
                  <p className="text-sm text-red-500">{errors[req]?.message as string}</p>
                )}
              </div>
            );
          })}

          {/* Draft Status */}
          {isDirty && (
            <Alert>
              <Save className="h-4 w-4" />
              <AlertDescription className="flex justify-between items-center">
                <span className="text-sm">✅ Draft auto-saved</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearDraft}
                >
                  Clear Draft
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('services')}
              className="flex-1"
              disabled={submitting}
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={!isValid || submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Request
            </Button>
=======
      <form onSubmit={handleSubmit} className="space-y-4">
        {requirements.map((req: string, idx: number) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700">{req}</label>
            <input
              type="text"
              placeholder={`Enter ${req}`}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              onChange={(e) => handleChange(req, e.target.value)}
              required
            />
>>>>>>> 433db316584fbc57538fb7ee5df35c6362c61f63
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300"
            disabled={submitting}
          >
            â† Back
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        
      </form>
    </div>
  );
}
