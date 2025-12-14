import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Download, X, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from '@/contexts/CartContext';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderDetails {
  orderId: string;
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
}

interface OrderReceiptProps {
  order: OrderDetails;
  onClose: () => void;
}

export const OrderReceipt = ({ order, onClose }: OrderReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('StudyEarn', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Order Receipt', 20, 32);
    
    // Order Info
    doc.setFontSize(12);
    doc.text(`Order #: ${order.orderId}`, 140, 25);
    doc.text(`Date: ${order.date.toLocaleDateString()}`, 140, 32);
    
    // Divider
    doc.setDrawColor(200);
    doc.line(20, 40, 190, 40);
    
    // Billing Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(order.shipping.fullName, 20, 57);
    doc.text(order.shipping.address, 20, 63);
    doc.text(`${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}`, 20, 69);
    doc.text(order.shipping.country, 20, 75);
    doc.text(order.shipping.email, 20, 81);
    doc.text(order.shipping.phone, 20, 87);
    
    // Items Table
    const tableData = order.items.map(item => [
      item.title,
      item.category,
      item.quantity.toString(),
      `$${item.cost.toFixed(2)}`,
      `$${(item.cost * item.quantity).toFixed(2)}`,
    ]);
    
    autoTable(doc, {
      startY: 95,
      head: [['Item', 'Category', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    
    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY);
    doc.text(`$${order.subtotal.toFixed(2)}`, 175, finalY, { align: 'right' });
    
    doc.text('VAT (7.5%):', 140, finalY + 6);
    doc.text(`$${order.tax.toFixed(2)}`, 175, finalY + 6, { align: 'right' });
    
    doc.setDrawColor(200);
    doc.line(140, finalY + 10, 190, finalY + 10);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 140, finalY + 18);
    doc.text(`$${order.total.toFixed(2)}`, 175, finalY + 18, { align: 'right' });
    
    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128);
    doc.text('Thank you for your purchase!', 105, finalY + 35, { align: 'center' });
    doc.text('For support, contact: support@studyearn.com', 105, finalY + 41, { align: 'center' });
    
    // Save
    doc.save(`StudyEarn-Receipt-${order.orderId}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Order Receipt</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div ref={receiptRef} className="space-y-6 p-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">StudyEarn</h2>
              <p className="text-sm text-muted-foreground">Order Receipt</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Order #{order.orderId}</p>
              <p className="text-sm text-muted-foreground">
                {order.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Billing Info */}
          <div>
            <h3 className="mb-2 font-semibold">Bill To:</h3>
            <div className="text-sm">
              <p className="font-medium">{order.shipping.fullName}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
              <p>{order.shipping.country}</p>
              <p className="mt-2">{order.shipping.email}</p>
              <p>{order.shipping.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="mb-4 font-semibold">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Item</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 text-center font-medium">Qty</th>
                    <th className="pb-2 text-right font-medium">Price</th>
                    <th className="pb-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3">{item.title}</td>
                      <td className="py-3">{item.category}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">${item.cost.toFixed(2)}</td>
                      <td className="py-3 text-right">${(item.cost * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (7.5%)</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 text-center text-sm text-muted-foreground">
            <p>Thank you for your purchase!</p>
            <p>For support, contact: support@studyearn.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t pt-4">
          <Button onClick={downloadPDF} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
