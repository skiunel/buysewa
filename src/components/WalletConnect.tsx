/**
 * Wallet Connection Component
 * Connects to MetaMask and displays wallet status
 */

import { useState, useEffect } from "react";
import { Wallet, LogOut, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { walletService, isMetaMaskInstalled } from "../services/blockchainReal";
import { toast } from "sonner";

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState<{ chainId: number; name: string } | null>(null);

  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    const connected = await walletService.isConnected();
    setIsConnected(connected);
    
    if (connected) {
      const addr = await walletService.getAddress();
      setAddress(addr);
      if (addr && onConnect) {
        onConnect(addr);
      }
      
      const net = await walletService.getNetwork();
      setNetwork(net);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress(null);
      if (onDisconnect) {
        onDisconnect();
      }
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
      if (onConnect) {
        onConnect(accounts[0]);
      }
    }
  };

  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask extension.');
      return;
    }

    setIsConnecting(true);
    try {
      const result = await walletService.connect();
      
      if (result.success && result.address) {
        setIsConnected(true);
        setAddress(result.address);
        
        const net = await walletService.getNetwork();
        setNetwork(net);
        
        toast.success('Wallet connected successfully!');
        
        if (onConnect) {
          onConnect(result.address);
        }
      } else {
        toast.error(result.error || 'Failed to connect wallet');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await walletService.disconnect();
    setIsConnected(false);
    setAddress(null);
    setNetwork(null);
    toast.info('Wallet disconnected');
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!isMetaMaskInstalled()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Wallet Connection</span>
          </CardTitle>
          <CardDescription>Connect your MetaMask wallet to use blockchain features</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              MetaMask is not installed. Please install MetaMask extension to connect your wallet.
            </AlertDescription>
          </Alert>
          <Button
            className="w-full mt-4"
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
          >
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isConnected && address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-green-600" />
            <span>Wallet Connected</span>
          </CardTitle>
          <CardDescription>Your wallet is connected and ready to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-mono text-sm font-semibold">{formatAddress(address)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>

          {network && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Network</p>
              <p className="text-sm font-semibold">{network.name} (Chain ID: {network.chainId})</p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleDisconnect}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5" />
          <span>Connect Wallet</span>
        </CardTitle>
        <CardDescription>Connect your MetaMask wallet to submit blockchain-verified reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full bg-[#003366] hover:bg-[#002244] text-white"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            'Connecting...'
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect MetaMask
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          By connecting, you agree to use MetaMask securely
        </p>
      </CardContent>
    </Card>
  );
}



