import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Package, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const refId = searchParams.get('refId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-[#00CC99] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. You'll receive a confirmation email shortly.
        </p>
        <div className="bg-gray-100 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-mono font-bold">{orderId || 'N/A'}</span>
          </div>
          {refId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-sm">{refId}</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <Button 
            className="w-full bg-[#003366] hover:bg-[#002244] text-white"
            onClick={() => navigate('/')}
          >
            <Package className="mr-2 h-4 w-4" />
            View My Orders
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );
}


