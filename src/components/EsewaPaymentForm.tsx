/**
 * eSewa Payment Form Component
 * Handles eSewa payment integration with proper HMAC signatures
 */

import { useState, useEffect } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface EsewaPaymentFormProps {
  amount: number;
  orderId: string;
  productName?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export function EsewaPaymentForm({ 
  amount, 
  orderId, 
  productName = 'BUYSEWA Order',
  onSuccess,
  onCancel 
}: EsewaPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch payment form data from backend
    fetchPaymentData();
  }, [amount, orderId]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/esewa/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId,
          productName,
          customerName: localStorage.getItem('userName') || 'Customer',
          customerEmail: localStorage.getItem('userEmail') || '',
          customerPhone: ''
        })
      });

      const data = await response.json();
      
      if (data.success && data.data && data.data.formData) {
        // Store both formData and formUrl
        setFormData({
          ...data.data.formData,
          formUrl: data.data.formUrl
        });
      } else {
        setError(data.message || 'Failed to initialize payment');
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    // Create a form and submit it to eSewa
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = formData.formUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    form.style.display = 'none';
    
    // Add all form fields (excluding formUrl as it's the action URL)
    Object.keys(formData).forEach(key => {
      if (key !== 'formUrl') {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      }
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#00CC99]" />
            <span className="ml-2">Initializing payment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPaymentData} variant="outline">
              Retry
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="outline" className="ml-2">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!formData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-600">No payment data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-green-600" />
          Pay with eSewa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Amount:</span>
              <span className="font-semibold">NPR {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="font-semibold">NPR {Math.floor(amount * 0.1).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-lg text-[#003366]">
                NPR {(amount + Math.floor(amount * 0.1)).toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with eSewa
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                onClick={onCancel} 
                variant="outline" 
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </form>

          <p className="text-xs text-gray-500 text-center">
            You will be redirected to eSewa's secure payment page
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

