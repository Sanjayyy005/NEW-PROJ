import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ShoppingBag, HeadphonesIcon, Gift, Truck, RefreshCw } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: ShoppingBag,
      title: 'Personal Shopping',
      description: 'Get personalized product recommendations based on your skin type, concerns, and preferences.',
      features: ['One-on-one consultation', 'Customized product selection', 'Follow-up support'],
    },
    {
      icon: Sparkles,
      title: 'Beauty Consultation',
      description: 'Expert advice from certified beauty professionals to help you achieve your beauty goals.',
      features: ['Skin analysis', 'Product compatibility', 'Routine recommendations'],
    },
    {
      icon: Gift,
      title: 'Gift Services',
      description: 'Create the perfect beauty gift with our curated gift sets and custom wrapping options.',
      features: ['Custom gift boxes', 'Premium wrapping', 'Personalized messages'],
    },
    {
      icon: Truck,
      title: 'Express Delivery',
      description: 'Fast and reliable shipping options to get your beauty products when you need them.',
      features: ['Same-day delivery available', 'Free shipping over $50', 'Tracked packages'],
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: 'Not satisfied? Our hassle-free return policy ensures your complete satisfaction.',
      features: ['30-day return window', 'Free return shipping', 'Full refund guarantee'],
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Our dedicated customer support team is always here to help with any questions or concerns.',
      features: ['Live chat support', 'Email assistance', 'Phone support available'],
    },
  ];

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond great products, we offer exceptional services to make your beauty journey seamless and enjoyable.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our beauty experts are here to assist you in finding the perfect products for your needs.
            </p>
            <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
              Contact Us Today
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
