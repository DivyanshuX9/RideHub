'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, CreditCard, Wallet, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PaymentMethod = {
  id: string;
  type: 'credit' | 'upi';
  provider: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string;
  isDefault: boolean;
};

export function PaymentMethods() {
  const { toast } = useToast();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [defaultMethod, setDefaultMethod] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<'card' | 'upi' | null>(null);
  const [upiId, setUpiId] = useState('');

  const handleSetDefault = (id: string) => {
    setDefaultMethod(id);
    setMethods(m => m.map(x => ({ ...x, isDefault: x.id === id })));
    toast({ title: 'Default payment method updated' });
  };

  const handleDelete = (id: string) => {
    setMethods(m => m.filter(x => x.id !== id));
    toast({ title: 'Payment method removed' });
  };

  const handleAddUpi = () => {
    if (!upiId.trim()) return;
    const newMethod: PaymentMethod = {
      id: `upi_${Date.now()}`,
      type: 'upi',
      provider: 'upi',
      upiId: upiId.trim(),
      isDefault: methods.length === 0,
    };
    setMethods(m => [...m, newMethod]);
    if (methods.length === 0) setDefaultMethod(newMethod.id);
    setUpiId('');
    setAddType(null);
    setAddOpen(false);
    toast({ title: 'UPI ID added' });
  };

  return (
    <div className="space-y-6">
      {methods.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No payment methods added yet.</p>
      ) : (
        <RadioGroup value={defaultMethod} onValueChange={handleSetDefault}>
          <div className="space-y-3">
            {methods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id}>
                        {method.type === 'upi' ? `📱 ${method.upiId}` : `💳 •••• ${method.last4}`}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && <Badge variant="outline">Default</Badge>}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(method.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
      )}

      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) setAddType(null); }}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Payment Method
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          {!addType ? (
            <div className="grid gap-3 py-4">
              <Button variant="outline" className="justify-start" onClick={() => setAddType('card')}>
                <CreditCard className="mr-2 h-4 w-4" /> Add Credit / Debit Card
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => setAddType('upi')}>
                <Wallet className="mr-2 h-4 w-4" /> Add UPI ID
              </Button>
            </div>
          ) : addType === 'upi' ? (
            <div className="space-y-4 py-4">
              <Input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              <Button className="w-full" onClick={handleAddUpi}>Add UPI</Button>
            </div>
          ) : (
            <div className="py-4 text-sm text-muted-foreground text-center">
              Card entry coming soon. Use UPI for now.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PaymentMethods() {
  const { toast } = useToast();
  const [methods, setMethods] = useState(paymentMethods);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [defaultMethod, setDefaultMethod] = useState(() => {
    const defaultMethod = methods.find(method => method.isDefault);
    return defaultMethod ? defaultMethod.id : '';
  });
  
  const handleSetDefault = (id: string) => {
    setDefaultMethod(id);
    setMethods(methods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    });
  };
  
  const handleDelete = (id: string) => {
    setMethods(methods.filter(method => method.id !== id));
    
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed successfully.",
    });
  };
  
  const getCardIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'visa':
        return "💳 Visa";
      case 'mastercard':
        return "💳 Mastercard";
      case 'googlepay':
        return "📱 Google Pay";
      default:
        return "💳";
    }
  };
  
  return (
    <div className="space-y-6">
      <RadioGroup value={defaultMethod} onValueChange={handleSetDefault}>
        <div className="space-y-3">
          <AnimatePresence>
            {methods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        
                        <div>
                          <Label htmlFor={method.id} className="flex items-center space-x-2">
                            <span className="font-medium">{getCardIcon(method.provider)}</span>
                            {method.type === 'credit' && (
                              <span>•••• {method.last4}</span>
                            )}
                            {method.type === 'upi' && (
                              <span>{method.upiId}</span>
                            )}
                          </Label>
                          
                          <div className="text-xs text-muted-foreground mt-1">
                            {method.type === 'credit' && (
                              <>Expires {method.expiryMonth}/{method.expiryYear}</>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge variant="outline">Default</Badge>
                        )}
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </RadioGroup>
      
      <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button variant="outline" className="justify-start" onClick={() => setAddCardOpen(false)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Add Credit or Debit Card
            </Button>
            
            <Button variant="outline" className="justify-start" onClick={() => setAddCardOpen(false)}>
              <Wallet className="mr-2 h-4 w-4" />
              Add UPI ID
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}