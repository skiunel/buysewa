import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>
        {orderId && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono font-bold">{orderId}</span>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <Button 
            className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white"
            onClick={() => navigate('/checkout')}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}


