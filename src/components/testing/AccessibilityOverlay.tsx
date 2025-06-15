
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccessibilityTester } from '@/utils/accessibility';
import { Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: Element;
}

export function AccessibilityOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanForIssues = () => {
    setIsScanning(true);
    const foundIssues: AccessibilityIssue[] = [];

    // Scan the entire document
    const ariaIssues = AccessibilityTester.validateAriaLabels(document.body);
    const keyboardIssues = AccessibilityTester.validateKeyboardNavigation(document.body);

    ariaIssues.forEach(issue => {
      foundIssues.push({
        type: 'error',
        message: issue
      });
    });

    keyboardIssues.forEach(issue => {
      foundIssues.push({
        type: 'warning',
        message: issue
      });
    });

    // Check for common accessibility patterns
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      foundIssues.push({
        type: 'warning',
        message: 'No heading elements found on page'
      });
    }

    const skipLinks = document.querySelectorAll('a[href^="#"]');
    if (skipLinks.length === 0) {
      foundIssues.push({
        type: 'info',
        message: 'Consider adding skip navigation links'
      });
    }

    setIssues(foundIssues);
    setIsScanning(false);
  };

  useEffect(() => {
    if (isVisible) {
      scanForIssues();
    }
  }, [isVisible]);

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIssueColor = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50"
        variant="outline"
        size="sm"
        aria-label={`${isVisible ? 'Hide' : 'Show'} accessibility overlay`}
      >
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        A11y
      </Button>

      {isVisible && (
        <Card className="fixed top-16 right-4 z-50 w-80 max-h-96 overflow-auto shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Accessibility Issues</CardTitle>
              <Button
                onClick={scanForIssues}
                disabled={isScanning}
                size="sm"
                variant="outline"
              >
                {isScanning ? 'Scanning...' : 'Rescan'}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {issues.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-green-600">No accessibility issues found!</p>
              </div>
            ) : (
              <>
                <div className="flex space-x-2 mb-3">
                  <Badge variant="destructive">
                    {issues.filter(i => i.type === 'error').length} Errors
                  </Badge>
                  <Badge variant="secondary">
                    {issues.filter(i => i.type === 'warning').length} Warnings
                  </Badge>
                  <Badge variant="outline">
                    {issues.filter(i => i.type === 'info').length} Info
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border text-sm ${getIssueColor(issue.type)}`}
                    >
                      <div className="flex items-start space-x-2">
                        {getIssueIcon(issue.type)}
                        <span className="flex-1">{issue.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
