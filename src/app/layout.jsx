import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Providers from "@/components/Providers";

export const metadata = {
  title: "BeautyHub - Premium Beauty Products",
  description: "Your one-stop destination for premium beauty products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Providers>
          {children}
        </Providers>
        
      </body>
    </html>
  );
}
