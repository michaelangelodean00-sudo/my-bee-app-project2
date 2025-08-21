import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const OfflineFallback: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 rounded-full bg-muted">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold">
            You're Offline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            It looks like you've lost your internet connection. Check your connection and try again.
          </p>
          
          <Button 
            onClick={handleRetry}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <div className="text-xs text-muted-foreground mt-4">
            <p>Some features may still work while offline:</p>
            <ul className="mt-2 space-y-1">
              <li>• View previously loaded content</li>
              <li>• Access your profile</li>
              <li>• Browse cached pages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineFallback;