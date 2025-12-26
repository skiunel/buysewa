import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, ArrowLeft, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";

export function DemoPaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('sessionId');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      completePayment();
    }, 5000);

    // Countdown
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, []);

  const completePayment = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/demo-payment/esewa/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate(`/payment/success?orderId=${orderId}&refId=${data.data.refId}`);
        }, 2000);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment completion error:', error);
      setStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Processing Payment...
              </h2>
              <p className="text-gray-600 mb-6">
                Please wait while we process your eSewa payment
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">NPR {Number(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Processing...</span>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Demo Payment - Redirecting in {countdown} seconds...</span>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to order confirmation...
              </p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6">
                There was an error processing your payment. Please try again.
              </p>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#003366] hover:bg-[#002244] text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Checkout
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}


