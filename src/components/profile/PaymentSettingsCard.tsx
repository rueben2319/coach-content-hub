
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const PaymentSettingsCard: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(profile?.paychangu_enabled || false);
  const [publicKey, setPublicKey] = useState(profile?.paychangu_public_key || '');
  const [secretKey, setSecretKey] = useState(profile?.paychangu_secret_key || '');
  const [saving, setSaving] = useState(false);

  // Only for coaches
  if (!profile || profile.role !== 'coach') return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        paychangu_enabled: enabled,
        paychangu_public_key: publicKey,
        paychangu_secret_key: secretKey
      });
      toast({
        title: "Saved!",
        description: "Your payment settings have been updated."
      });
    } catch (e: any) {
      toast({
        title: "Failed to save",
        description: e.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Integration</CardTitle>
        <CardDescription>
          Enable PayChangu to accept payments for your courses. Clients cannot pay until this is enabled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="mr-2"
            />
            Enable PayChangu Payments
          </label>
          <Input
            label="PayChangu Public Key"
            placeholder="Enter your PayChangu public key"
            value={publicKey}
            onChange={e => setPublicKey(e.target.value)}
            disabled={!enabled}
          />
          <Input
            label="PayChangu Secret Key"
            placeholder="Enter your PayChangu secret key"
            value={secretKey}
            onChange={e => setSecretKey(e.target.value)}
            disabled={!enabled}
            type="password"
          />
          <Button onClick={handleSave} disabled={saving || !enabled} className="w-full">
            {saving ? 'Saving...' : 'Save Payment Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
