"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock, ShoppingBag, Wallet, Smartphone, Banknote } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  // Payment methods configuration - you can add your payment links here
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with your card',
      icon: CreditCard,
      link: '', // Add your payment link here if needed
    },
    {
      id: 'esewa',
      name: 'eSewa Mobile Wallet',
      description: 'eSewa Digital Payment',
      icon: Wallet,
      link: '', // Add eSewa payment link here
    },
    {
      id: 'khalti',
      name: 'Khalti by IME',
      description: 'Mobile Wallet',
      icon: Smartphone,
      link: '', // Add Khalti payment link here
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: Banknote,
      link: '', // No link needed for COD
    },
  ];

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleShippingChange = (e) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePaymentMethodSelect = (methodId, link) => {
    setSelectedPaymentMethod(methodId);
    
    // If payment method has a link, open it in new tab
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: Date.now().toString(),
        items: cart,
        total: cartTotal + (cartTotal >= 50 ? 0 : 5.99),
        shippingInfo,
        paymentMethod: selectedPaymentMethod,
        date: new Date().toISOString(),
        status: 'Processing',
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();
      setOrderPlaced(true);
      setLoading(false);

      // Redirect to success message
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }, 2000);
  };

  if (cartCount === 0 && !orderPlaced) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen py-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
              <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">
                Add items to your cart before checking out
              </p>
              <Link href="/products">
                <Button size="lg">Browse Products</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (orderPlaced) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Thank you for your purchase. We'll send you a confirmation email shortly.
              </p>
              <div className="bg-secondary/30 p-6 rounded-lg mb-8">
                <p className="text-sm text-muted-foreground mb-2">Order Total</p>
                <p className="text-3xl font-bold text-primary">
                  ${(cartTotal + (cartTotal >= 50 ? 0 : 5.99)).toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to homepage...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          {!isPending && !session?.user && (
            <Card className="mb-8 border-2">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Sign in</h3>
                    <p className="text-sm text-muted-foreground">
                      to access faster checkout and order tracking.
                    </p>
                  </div>
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>
                      Enter your shipping details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handlePaymentMethodSelect(method.id, method.link)}
                            className={`relative p-6 border-2 rounded-lg transition-all hover:border-primary hover:shadow-md ${
                              selectedPaymentMethod === method.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-card'
                            }`}
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <div className={`p-3 rounded-full ${
                                selectedPaymentMethod === method.id
                                  ? 'bg-primary/10'
                                  : 'bg-secondary'
                              }`}>
                                <Icon className={`h-8 w-8 ${
                                  selectedPaymentMethod === method.id
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                }`} />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{method.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                            {selectedPaymentMethod === method.id && (
                              <div className="absolute top-2 right-2">
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-primary-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Additional instructions based on selected payment method */}
                    {selectedPaymentMethod === 'khalti' && (
                      <div className="mt-6 p-4 bg-secondary/30 rounded-lg text-sm">
                        <p className="font-semibold mb-2">
                          You will be redirected to your Khalti account to complete your payment:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                          <li>Login to your Khalti account using your Khalti ID and PIN</li>
                          <li>Ensure your Khalti account is active and has sufficient balance</li>
                          <li>Enter OTP (one time password) sent to your registered mobile number</li>
                        </ol>
                        <p className="mt-3 text-xs italic">***Login with your Khalti mobile and PIN.***</p>
                      </div>
                    )}

                    {selectedPaymentMethod === 'esewa' && (
                      <div className="mt-6 p-4 bg-secondary/30 rounded-lg text-sm">
                        <p className="font-semibold mb-2">
                          You will be redirected to your eSewa account to complete your payment:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                          <li>Login to your eSewa account</li>
                          <li>Verify payment details</li>
                          <li>Confirm the transaction</li>
                        </ol>
                      </div>
                    )}

                    {selectedPaymentMethod === 'cod' && (
                      <div className="mt-6 p-4 bg-secondary/30 rounded-lg text-sm">
                        <p className="font-semibold mb-2">Cash on Delivery</p>
                        <p className="text-muted-foreground">
                          Pay with cash when your order is delivered to your doorstep.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Information - Only show for card payments */}
                {selectedPaymentMethod === 'card' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Card Information
                      </CardTitle>
                      <CardDescription>
                        All transactions are secure and encrypted
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg text-sm">
                        <p className="font-semibold mb-2">💳 Test Mode - Use Test Card:</p>
                        <p>Card Number: 4242 4242 4242 4242</p>
                        <p>Expiry: Any future date (MM/YY)</p>
                        <p>CVV: Any 3 digits</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          maxLength={19}
                          required={selectedPaymentMethod === 'card'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentChange}
                          required={selectedPaymentMethod === 'card'}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            maxLength={5}
                            required={selectedPaymentMethod === 'card'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            maxLength={3}
                            required={selectedPaymentMethod === 'card'}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'} and shipping fee included)
                        </span>
                        <span className="font-medium">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {cartTotal >= 50 ? 'FREE' : '$5.99'}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount</span>
                          <span className="text-orange-600 dark:text-orange-500">
                            ${(cartTotal + (cartTotal >= 50 ? 0 : 5.99)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        'Processing...'
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Pay Now
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Your payment information is secure and encrypted
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}