import { useState, useEffect } from "react";
import { Star, Shield, Upload, AlertCircle, CheckCircle, Lock, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface ReviewSubmissionProps {
  onNavigate: (page: string) => void;
}

export function ReviewSubmission({ onNavigate }: ReviewSubmissionProps) {
  const [step, setStep] = useState(1);
  const [sdcCode, setSdcCode] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [verified, setVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSDCVerification = async () => {
    if (!sdcCode.trim()) {
      alert('Please enter an SDC code');
      return;
    }

    try {
      const { sdcAPI } = await import('../services/api');
      const response = await sdcAPI.verify(sdcCode);
      
      if (response.success && response.data.canUse) {
        setVerified(true);
        setStep(2);
      } else {
        alert(response.message || 'Invalid SDC code');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to verify SDC code');
      console.error('SDC verification error:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      alert('Please provide a rating and review text');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please login to submit a review');
        onNavigate('login');
        return;
      }

      // Get product ID from verified SDC (in production, get from SDC data)
      const { sdcAPI } = await import('../services/api');
      const sdcResponse = await sdcAPI.verify(sdcCode);
      
      if (!sdcResponse.success || !sdcResponse.data.sdc) {
        alert('SDC verification failed');
        return;
      }

      const productId = sdcResponse.data.sdc.productId?._id || sdcResponse.data.sdc.productId;

      const { reviewAPI } = await import('../services/api');
      const response = await reviewAPI.create({
        sdcCode,
        productId,
        userId,
        rating,
        comment: reviewText,
        images: []
      });

      if (response.success) {
        setSubmitted(true);
        setStep(3);
      } else {
        alert(response.message || 'Failed to submit review');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to submit review');
      console.error('Review submission error:', error);
    }
  };

  const [productDetails, setProductDetails] = useState<any>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (verified && sdcCode) {
        try {
          const { sdcAPI } = await import('../services/api');
          const response = await sdcAPI.verify(sdcCode);
          if (response.success && response.data.sdc) {
            const sdc = response.data.sdc;
            if (sdc.productId) {
              const { productAPI } = await import('../services/api');
              const productResponse = await productAPI.getById(sdc.productId._id || sdc.productId);
              if (productResponse.success) {
                setProductDetails({
                  name: productResponse.data.name,
                  image: productResponse.data.image,
                  orderDate: new Date().toLocaleDateString(),
                  orderNumber: sdc.orderId?.orderNumber || 'N/A'
                });
              }
            }
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }
    };
    fetchProductDetails();
  }, [verified, sdcCode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Submit Verified Review</h1>
            <p className="text-gray-600">Help other customers with your honest feedback</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 1, label: "Verify Purchase", active: step >= 1 },
              { step: 2, label: "Write Review", active: step >= 2 },
              { step: 3, label: "Blockchain Verification", active: step >= 3 }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.active
                      ? "bg-[#00CC99] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.active && step > item.step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm">{item.step}</span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{item.label}</span>
                {index < 2 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      step > item.step ? "bg-[#00CC99]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: SDC Verification */}
            {step === 1 && (
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="h-6 w-6 text-[#00CC99]" />
                  <h2 className="text-xl font-semibold">Verify Your Purchase</h2>
                </div>
                
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    To submit a verified review, enter the Standard Delivery Code (SDC) 
                    you received with your order. This ensures only genuine buyers can leave reviews.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sdc">Standard Delivery Code (SDC)</Label>
                    <Input
                      id="sdc"
                      value={sdcCode}
                      onChange={(e) => setSdcCode(e.target.value)}
                      placeholder="Enter your SDC (e.g., SDC-BUY-2024-789123)"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      You can find this code in your delivery confirmation email or on the delivery receipt.
                    </p>
                  </div>

                  <Button
                    onClick={handleSDCVerification}
                    disabled={!sdcCode}
                    className="w-full bg-[#00CC99] hover:bg-[#00b88a] text-white"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Purchase
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-900">How to get your SDC Code:</h3>
                  <p className="text-sm text-blue-800 mb-2">
                    1. Place an order and complete payment<br/>
                    2. Wait for order delivery<br/>
                    3. Check "My Orders" in your dashboard<br/>
                    4. Find the SDC code for your delivered order
                  </p>
                </div>
              </Card>
            )}

            {/* Step 2: Review Form */}
            {step === 2 && (
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle className="h-6 w-6 text-[#00CC99]" />
                  <h2 className="text-xl font-semibold">Write Your Review</h2>
                </div>

                <div className="space-y-6">
                  {/* Rating */}
                  <div>
                    <Label className="text-base font-medium">Overall Rating</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-colors"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-4 text-gray-600">
                        {rating > 0 && (
                          <>
                            {rating} star{rating > 1 ? "s" : ""} - {
                              rating === 5 ? "Excellent" :
                              rating === 4 ? "Good" :
                              rating === 3 ? "Average" :
                              rating === 2 ? "Poor" : "Very Poor"
                            }
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <Label htmlFor="review">Your Review</Label>
                    <Textarea
                      id="review"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this product. What did you like or dislike? How was the quality, delivery, and overall experience?"
                      className="mt-2 min-h-[120px]"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {reviewText.length}/500 characters
                    </p>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <Label>Add Photos (Optional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload photos of your product
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB each (max 3 photos)
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    disabled={!rating || !reviewText.trim()}
                    className="w-full bg-[#003366] hover:bg-[#002244] text-white"
                  >
                    Submit Review
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Blockchain Verification */}
            {step === 3 && (
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-[#00CC99] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Review Submitted Successfully!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Your review has been recorded on the blockchain and will be visible to other customers 
                  within 24 hours after verification.
                </p>

                {submitted && (
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Lock className="h-4 w-4 text-[#00CC99]" />
                      <span className="font-medium text-[#00CC99]">Blockchain Verification</span>
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      Your review has been submitted and will be verified on the blockchain.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={() => onNavigate("product")}
                    className="w-full bg-[#003366] hover:bg-[#002244] text-white"
                  >
                    View Product Page
                  </Button>
                  <Button
                    onClick={() => onNavigate("home")}
                    variant="outline"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Product Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="font-semibold mb-4">Product Details</h3>
              
              <div className="space-y-4">
                {productDetails ? (
                  <>
                    <ImageWithFallback
                      src={productDetails.image}
                      alt={productDetails.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    
                    <div>
                      <h4 className="font-medium">{productDetails.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Order #{productDetails.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Delivered on {productDetails.orderDate}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Product details will appear after SDC verification</p>
                  </div>
                )}

                {verified && (
                  <Badge className="bg-[#00CC99] text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Purchase Verified
                  </Badge>
                )}
              </div>

              <div className="mt-6 p-4 bg-[#00CC99] bg-opacity-10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-[#00CC99]" />
                  <span className="text-sm font-medium text-[#00CC99]">
                    Blockchain Protection
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Your review will be cryptographically secured and cannot be 
                  altered or deleted, ensuring authenticity for future buyers.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}