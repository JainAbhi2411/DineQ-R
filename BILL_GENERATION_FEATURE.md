# Bill Generation Feature - Complete Guide

## Overview
The restaurant management system now includes a comprehensive bill generation feature that allows customers and restaurant owners to view, print, and download detailed invoices for orders.

## Features

### 1. **Comprehensive Bill Details**
The generated bill includes all essential information:

#### Restaurant Information
- Restaurant name (prominently displayed)
- Complete address
- Location details
- Phone number
- Contact details

#### Invoice Details
- Unique invoice number (based on order ID)
- Date and time of order
- Order status
- Payment status

#### Customer Information
- Customer name
- Phone number
- Email address
- Table number or takeaway status
- Waiter assigned (if applicable)

#### Order Items
Each item displays:
- Item name
- Variant (if selected)
- Portion size (Half/Full)
- Quantity
- Unit price
- Total amount
- Special notes/instructions

#### Financial Breakdown
- **Subtotal**: Sum of all items
- **Discount**: Applied promo code and discount amount
- **Subtotal After Discount**: Amount after applying discount
- **CGST (2.5%)**: Central Goods and Services Tax
- **SGST (2.5%)**: State Goods and Services Tax
- **Total Tax (5%)**: Combined tax amount
- **Grand Total**: Final payable amount

#### Payment Information
- Payment method (Online/Cash on Collection)
- Payment status with color-coded badge
- Special instructions (if any)

#### Additional Features
- **QR Code**: For order verification
- **Terms & Conditions**: Standard terms displayed
- **Generation timestamp**: When the bill was generated

### 2. **Bill Actions**

#### Print Bill
- Click "Print Bill" button to open print dialog
- Optimized print layout
- Removes unnecessary UI elements during printing
- Professional invoice format

#### Download PDF
- Click "Download PDF" button to generate and download
- High-quality PDF generation using html2canvas and jsPDF
- Filename format: `bill-[ORDER_ID].pdf`
- Includes all bill details in the PDF
- Success notification on download

### 3. **Access Points**

#### For Customers

**Order Tracking Page** (`/customer/orders/:orderId`)
- View real-time order status
- Click "View Detailed Bill" button at the bottom
- Opens bill in a modal dialog
- Can print or download from the modal

**Order History Page** (`/customer/orders`)
- View all past orders
- Expand any order card
- Click "Print E-Bill" button (available for completed orders)
- Opens bill in a modal dialog

#### For Restaurant Owners

**Order Management Page** (`/owner/restaurant/:restaurantId/orders`)
- View all restaurant orders
- Expand any order card
- Click "Print E-Bill" button (available for completed orders)
- Opens bill in a modal dialog

## Technical Implementation

### Components

#### PrintBill Component
**Location**: `src/components/order/PrintBill.tsx`

**Features**:
- Responsive layout
- Print-optimized styles
- PDF generation capability
- QR code integration
- Tax calculations
- Discount handling

**Props**:
```typescript
interface PrintBillProps {
  order: OrderWithItems;
}
```

**Key Functions**:
- `handlePrint()`: Opens browser print dialog
- `handleDownload()`: Generates and downloads PDF

### Dependencies
- **html2canvas**: Converts HTML to canvas for PDF generation
- **jsPDF**: Creates PDF documents from canvas
- **qrcode**: Generates QR codes for order verification

### Calculations

#### Tax Calculation
```typescript
const subtotal = order.order_items?.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0) || 0;
const discountAmount = order.discount_amount || 0;
const subtotalAfterDiscount = subtotal - discountAmount;
const cgst = subtotalAfterDiscount * 0.025; // 2.5%
const sgst = subtotalAfterDiscount * 0.025; // 2.5%
const totalTax = cgst + sgst; // 5%
const grandTotal = subtotalAfterDiscount + totalTax;
```

## User Experience

### Visual Design
- Clean, professional invoice layout
- Clear typography hierarchy
- Color-coded payment status badges
- Organized sections with proper spacing
- Border separators for clarity

### Responsive Design
- Optimized for desktop viewing
- Scrollable content in modal
- Print-friendly layout
- Mobile-accessible

### Loading States
- Download button shows "Downloading..." during PDF generation
- Disabled state prevents multiple clicks
- Toast notifications for success/error

## Testing the Feature

### As a Customer

1. **Place an Order**
   - Scan QR code or browse restaurants
   - Add items to cart
   - Complete checkout

2. **Track Order**
   - Navigate to Order Tracking page
   - View order status updates
   - Click "View Detailed Bill" button

3. **View Bill**
   - Bill opens in modal dialog
   - Review all order details
   - Check tax breakdown

4. **Print Bill**
   - Click "Print Bill" button
   - Browser print dialog opens
   - Select printer and print

5. **Download PDF**
   - Click "Download PDF" button
   - Wait for generation (1-2 seconds)
   - PDF downloads automatically
   - Check Downloads folder

### As a Restaurant Owner

1. **Access Order Management**
   - Navigate to restaurant orders
   - View all orders

2. **View Completed Orders**
   - Expand any completed order
   - Click "Print E-Bill" button

3. **Generate Bill**
   - Bill opens in modal
   - Review customer and order details
   - Print or download as needed

## Error Handling

### PDF Generation Errors
- Catches canvas generation errors
- Shows error toast notification
- Logs error to console for debugging
- Gracefully handles failures

### Missing Data
- Handles optional fields gracefully
- Shows "Walk-in Customer" if no customer data
- Displays "Takeaway" if no table assigned
- Shows 0 discount if no promo applied

## Best Practices

### For Customers
- Download bills for record-keeping
- Verify order details before payment
- Check tax calculations
- Save PDF for warranty/returns

### For Restaurant Owners
- Print bills for completed orders
- Keep digital copies for accounting
- Verify payment status before closing orders
- Use QR codes for order verification

## Future Enhancements

Potential improvements:
- Email bill to customer
- SMS bill link
- Customizable tax rates
- Multiple currency support
- Restaurant logo upload
- Custom terms & conditions
- Bill templates
- Bulk bill generation
- Export to accounting software

## Troubleshooting

### PDF Not Downloading
- Check browser permissions
- Disable popup blockers
- Try different browser
- Check console for errors

### Print Layout Issues
- Use Chrome/Edge for best results
- Check print preview
- Adjust page margins
- Select correct paper size

### Missing Information
- Ensure order is fully loaded
- Check database for complete data
- Verify restaurant details are set
- Confirm customer profile exists

## Support

For issues or questions:
1. Check console for error messages
2. Verify order data is complete
3. Test in different browsers
4. Contact system administrator

---

**Last Updated**: December 2025
**Version**: 1.0.0
