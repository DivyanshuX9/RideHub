'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, CreditCard, Wallet, Edit, Trash2 } from 'lucide-react';
import { paymentMethods } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

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