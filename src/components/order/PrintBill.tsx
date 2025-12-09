import { OrderWithItems } from '@/types/types';
import { format } from 'date-fns';
import { useFormatters } from '@/hooks/useFormatters';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

interface PrintBillProps {
  order: OrderWithItems;
}

export default function PrintBill({ order }: PrintBillProps) {
  const { formatCurrency } = useFormatters();
  const { toast } = useToast();
  const billRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!billRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`bill-${order.id.slice(0, 8).toUpperCase()}.pdf`);
      
      toast({
        title: 'Success',
        description: 'Bill downloaded successfully',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to download bill',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const discountAmount = order.discount_amount || 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const cgst = subtotalAfterDiscount * 0.025;
  const sgst = subtotalAfterDiscount * 0.025;
  const totalTax = cgst + sgst;
  const grandTotal = subtotalAfterDiscount + totalTax;

  return (
    <div className="print-bill">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-bill, .print-bill * {
            visibility: visible;
          }
          .print-bill {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div ref={billRef} className="max-w-3xl mx-auto p-8 bg-white text-black">
        {/* Header with Restaurant Info */}
        <div className="text-center mb-6 pb-6 border-b-2 border-black">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">{order.restaurant?.name || 'Restaurant'}</h1>
          {order.restaurant?.address && (
            <p className="text-sm mb-1">{order.restaurant.address}</p>
          )}
          {order.restaurant?.location && (
            <p className="text-sm mb-1">{order.restaurant.location}</p>
          )}
          {order.restaurant?.phone && (
            <p className="text-sm mb-1">Phone: {order.restaurant.phone}</p>
          )}
          {order.restaurant?.contact_details && (
            <p className="text-sm">{order.restaurant.contact_details}</p>
          )}
        </div>

        {/* Bill Title and Order Info */}
        <div className="text-center mb-6 pb-4 border-b border-gray-400">
          <h2 className="text-3xl font-bold mb-2">TAX INVOICE</h2>
          <div className="flex justify-between items-center text-sm mt-4 max-w-md mx-auto">
            <div className="text-left">
              <p className="font-semibold">Invoice No:</p>
              <p className="text-xs">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Date & Time:</p>
              <p className="text-xs">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
            </div>
          </div>
        </div>

        {/* Customer and Table Details */}
        <div className="mb-6 grid grid-cols-2 gap-6 text-sm pb-4 border-b border-gray-300">
          <div className="space-y-1">
            <p className="font-bold text-base mb-2">Bill To:</p>
            {order.customer ? (
              <>
                <p><strong>Name:</strong> {order.customer.full_name || order.customer.username}</p>
                {order.customer.phone && <p><strong>Phone:</strong> {order.customer.phone}</p>}
                {order.customer.email && <p><strong>Email:</strong> {order.customer.email}</p>}
              </>
            ) : (
              <p>Walk-in Customer</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="font-bold text-base mb-2">Order Details:</p>
            <p><strong>Table:</strong> {order.table ? `Table ${order.table.table_number}` : 'Takeaway'}</p>
            <p><strong>Order Status:</strong> <span className="capitalize">{order.status}</span></p>
            {order.waiter && (
              <p><strong>Served By:</strong> {order.waiter.name}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b-2 border-black bg-gray-100">
              <th className="text-left py-3 px-2">#</th>
              <th className="text-left py-3 px-2">Item Description</th>
              <th className="text-center py-3 px-2">Qty</th>
              <th className="text-right py-3 px-2">Rate</th>
              <th className="text-right py-3 px-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-300">
                <td className="py-3 px-2">{index + 1}</td>
                <td className="py-3 px-2">
                  <div>
                    <p className="font-semibold">{item.menu_item_name}</p>
                    {item.variant_name && (
                      <p className="text-xs text-gray-600">Variant: {item.variant_name}</p>
                    )}
                    {item.portion_size && (
                      <p className="text-xs text-gray-600">
                        Portion: {item.portion_size === 'half' ? 'Half' : 'Full'}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-gray-600 italic mt-1">Note: {item.notes}</p>
                    )}
                  </div>
                </td>
                <td className="text-center py-3 px-2">{item.quantity}</td>
                <td className="text-right py-3 px-2">{formatCurrency(item.price)}</td>
                <td className="text-right py-3 px-2 font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Summary */}
        <div className="flex justify-end mb-6">
          <div className="w-80 space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-300 text-green-600">
                <span className="flex items-center gap-2">
                  Discount
                  {order.promo_code && <span className="text-xs">({order.promo_code})</span>}:
                </span>
                <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span>Subtotal After Discount:</span>
              <span className="font-semibold">{formatCurrency(subtotalAfterDiscount)}</span>
            </div>
            
            <div className="flex justify-between py-1 text-xs">
              <span>CGST (2.5%):</span>
              <span>{formatCurrency(cgst)}</span>
            </div>
            
            <div className="flex justify-between py-1 text-xs border-b border-gray-300">
              <span>SGST (2.5%):</span>
              <span>{formatCurrency(sgst)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-semibold">Total Tax (5%):</span>
              <span className="font-semibold">{formatCurrency(totalTax)}</span>
            </div>
            
            <div className="flex justify-between py-3 border-t-2 border-black bg-gray-100 px-3 -mx-3">
              <span className="text-lg font-bold">GRAND TOTAL:</span>
              <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-300">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1">Payment Method:</p>
              <p className="capitalize">
                {order.payment_method === 'coc' ? 'Cash on Collection' : 'Online Payment'}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Payment Status:</p>
              <p className="capitalize">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.payment_status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {order.special_instructions && (
          <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm font-semibold mb-1">Special Instructions:</p>
            <p className="text-sm">{order.special_instructions}</p>
          </div>
        )}

        {/* QR Code for Verification */}
        <div className="mb-6 flex justify-center">
          <div className="text-center">
            <QRCodeDataUrl 
              text={`ORDER-${order.id}`}
              width={120}
              className="mx-auto mb-2"
            />
            <p className="text-xs text-gray-600">Scan to verify order</p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6 text-xs text-gray-600 border-t border-gray-300 pt-4">
          <p className="font-semibold mb-2">Terms & Conditions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All prices are inclusive of applicable taxes</li>
            <li>Goods once sold will not be taken back or exchanged</li>
            <li>All disputes are subject to local jurisdiction only</li>
            <li>This is a computer-generated invoice and does not require a signature</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-sm border-t-2 border-black pt-4">
          <p className="font-bold text-lg mb-2">Thank You for Dining With Us!</p>
          <p className="text-xs text-gray-600 mb-1">
            We hope you enjoyed your meal. Please visit us again!
          </p>
          <p className="text-xs text-gray-600">
            Generated on {format(new Date(), 'MMM dd, yyyy HH:mm:ss')}
          </p>
        </div>

        {/* Action Buttons (hidden when printing) */}
        <div className="no-print mt-8 flex gap-4 justify-center">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Bill
          </Button>
          <Button
            onClick={handleDownload}
            size="lg"
            className="gap-2"
            disabled={downloading}
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}
