import { useState, useEffect } from "react";
import { Shield, Link2, AlertCircle, CheckCircle, Loader2, ExternalLink, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { smartContract, ipfsService } from "../services/blockchain";
import { toast } from "sonner@2.0.3";

interface BlockchainReviewProps {
  productId: number;
  productName: string;
  userId: string;
  sdcCode?: string;
  onSubmitSuccess: (reviewData: any) => void;
}

export function BlockchainReview({ productId, productName, userId, sdcCode, onSubmitSuccess }: BlockchainReviewProps) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sdcInput, setSdcInput] = useState(sdcCode || '');
  const [sdcVerified, setSdcVerified] = useState(false);
  const [isVerifyingSDC, setIsVerifyingSDC] = useState(false);
  
  // Blockchain state
  const [txHash, setTxHash] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [gasEstimate, setGasEstimate] = useState('');

  useEffect(() => {
    checkWalletConnection();
    if (sdcCode) {
      verifySDC(sdcCode);
    }
  }, []);

  const checkWalletConnection = async () => {
    const connected = await smartContract.isWalletConnected();
    if (connected) {
      const address = smartContract.getWalletAddress();
      setWalletConnected(true);
      setWalletAddress(address || '');
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const response = await smartContract.connectWallet();
      setWalletConnected(true);
      setWalletAddress(response.address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const verifySDC = async (code: string) => {
    if (!code) return;
    
    setIsVerifyingSDC(true);
    try {
      const response = await smartContract.verifySDC(code);
      setSdcVerified(response.valid);
      
      if (response.valid) {
        toast.success('SDC code verified on blockchain!');
      } else {
        toast.error('Invalid SDC code - not found on blockchain');
      }
    } catch (error) {
      toast.error('Error verifying SDC code');
      setSdcVerified(false);
    } finally {
      setIsVerifyingSDC(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!walletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!sdcVerified) {
      toast.error('Please verify your SDC code first');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit review to blockchain
      const reviewData = {
        productId,
        userId,
        rating,
        comment,
        sdcCode: sdcInput
      };

      const response = await smartContract.submitReview(reviewData);
      
      setTxHash(response.txHash);
      setIpfsHash(response.ipfsHash);
      setReviewSubmitted(true);

      toast.success('Review submitted to blockchain successfully!');
      
      // Call parent callback
      onSubmitSuccess({
        ...reviewData,
        txHash: response.txHash,
        ipfsHash: response.ipfsHash,
        verified: true
      });

    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review to blockchain');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reviewSubmitted) {
    return (
      <Card className="border-[#00CC99]">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#00CC99] bg-opacity-10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-[#00CC99]" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Review Submitted Successfully!</h3>
              <p className="text-gray-600">Your review has been verified and stored on the blockchain</p>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Transaction Hash:</span>
                <a
                  href={`https://polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00CC99] hover:underline flex items-center"
                >
                  {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">IPFS Hash:</span>
                <a
                  href={`https://ipfs.io/ipfs/${ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00CC99] hover:underline flex items-center"
                >
                  {ipfsHash.substring(0, 10)}...{ipfsHash.substring(ipfsHash.length - 8)}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            <Badge className="bg-[#00CC99] text-white">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <Card className={walletConnected ? "border-[#00CC99]" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {walletConnected ? (
            <div className="space-y-3">
              <Alert className="bg-[#00CC99] bg-opacity-10 border-[#00CC99]">
                <CheckCircle className="h-4 w-4 text-[#00CC99]" />
                <AlertDescription className="text-[#00CC99]">
                  Wallet Connected
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Address:</span>
                <code className="text-sm font-mono">
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </code>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connect your wallet to submit a blockchain-verified review
                </AlertDescription>
              </Alert>
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SDC Verification */}
      <Card className={sdcVerified ? "border-[#00CC99]" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            SDC Code Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label htmlFor="sdc">Standard Delivery Code (SDC)</Label>
              <div className="flex space-x-2">
                <Input
                  id="sdc"
                  value={sdcInput}
                  onChange={(e) => setSdcInput(e.target.value)}
                  placeholder="SDC-BUY-2024-XXXXXX"
                  disabled={sdcVerified}
                />
                <Button
                  onClick={() => verifySDC(sdcInput)}
                  disabled={!sdcInput || sdcVerified || isVerifyingSDC}
                  variant="outline"
                >
                  {isVerifyingSDC ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : sdcVerified ? (
                    <CheckCircle className="h-4 w-4 text-[#00CC99]" />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </div>

            {sdcVerified && (
              <Alert className="bg-[#00CC99] bg-opacity-10 border-[#00CC99]">
                <CheckCircle className="h-4 w-4 text-[#00CC99]" />
                <AlertDescription className="text-[#00CC99]">
                  SDC code verified on blockchain - You can submit a review
                </AlertDescription>
              </Alert>
            )}

            <p className="text-xs text-gray-600">
              Your SDC code proves you purchased this product. It's required for blockchain verification.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Write Your Review</CardTitle>
          <p className="text-sm text-gray-600">For: {productName}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={5}
            />
          </div>

          <Alert>
            <Shield className="h-4 w-4 text-[#00CC99]" />
            <AlertDescription>
              Your review will be stored on IPFS and verified on the blockchain. This ensures it cannot be tampered with or deleted.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleSubmitReview}
            disabled={!walletConnected || !sdcVerified || isSubmitting || rating === 0 || !comment.trim()}
            className="w-full bg-[#00CC99] hover:bg-[#00b88a] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting to Blockchain...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Submit Blockchain-Verified Review
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
