import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Users, Heart, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">About BeautyHub</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted partner in discovering premium beauty products that enhance your natural radiance.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2020, BeautyHub was born from a simple belief: everyone deserves access to high-quality, 
                  effective beauty products that make them feel confident and beautiful.
                </p>
                <p className="text-muted-foreground mb-4">
                  We started as a small online boutique and have grown into a trusted destination for beauty 
                  enthusiasts worldwide. Our carefully curated collection features products from renowned brands 
                  and emerging innovators alike.
                </p>
                <p className="text-muted-foreground">
                  Every product we offer is selected with care, tested thoroughly, and backed by our commitment 
                  to quality and customer satisfaction.
                </p>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop"
                  alt="About BeautyHub"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  Your satisfaction and trust are our top priorities in everything we do.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every product meets our rigorous standards.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Inclusivity</h3>
                <p className="text-muted-foreground">
                  Beauty is for everyone. We celebrate diversity and offer products for all.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  We're committed to eco-friendly practices and sustainable sourcing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Founder & CEO',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
                },
                {
                  name: 'Emily Chen',
                  role: 'Product Curator',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
                },
                {
                  name: 'Michael Roberts',
                  role: 'Customer Experience Director',
                  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
                },
              ].map((member) => (
                <div key={member.name} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
