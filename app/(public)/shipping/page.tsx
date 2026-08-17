export const metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div className="container max-w-2xl py-24">
      <h1 className="font-display text-4xl font-bold">Shipping</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>Minimum opening order: $250.</p>
        <p>Free shipping on wholesale orders over $1,000. Orders under $1,000 ship at a flat rate calculated at checkout.</p>
        <p>Most in-stock orders ship within 3-5 business days. Tracking information is available on your order detail page once a shipment goes out.</p>
      </div>
    </div>
  );
}
