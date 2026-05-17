export interface ShopSettings {
  name: string;
  logo: string; // base64
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  website: string;
  accentColor: string;
}

export interface Product {
  id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  district: string;
  thana: string;
  subTotal: number;
  discount: number;
  advancePaid: number;
  deliveryCharge: number;
  codAmount: number;
  courierName: string;
  notes: string;
  products: Product[];
}

export type Language = 'en' | 'bn';

export const TRANSLATIONS = {
  en: {
    appTitle: "SlipCraft",
    shopSetup: "Shop Profile Setup",
    shopName: "Shop Name",
    shopLogo: "Shop Logo",
    logoDesc: "Upload your brand logo (PNG/JPG)",
    contactInfo: "Contact Information",
    phone: "Phone Number",
    email: "Email Address",
    address: "Warehouse Address",
    social: "Social Media & Web",
    facebook: "Facebook Page Link",
    web: "Website URL",
    saveSettings: "Save Shop Profile",
    orderForm: "Customer & Order Details",
    customerInfo: "Customer Details",
    name: "Customer Name",
    mobile: "Mobile Number",
    deliveryAddress: "Full Delivery Address",
    district: "District",
    thana: "Thana",
    orderInfo: "Order Details",
    orderId: "Order ID / Tracking Number",
    orderDate: "Order Date",
    productInfo: "Products",
    productName: "Product Name/Code",
    size: "Size",
    color: "Color",
    price: "Price",
    qty: "Qty",
    addProduct: "Add More Product",
    paymentInfo: "Payment & Courier",
    subTotal: "Sub Total",
    discount: "Discount",
    advancePaid: "Advance Paid",
    deliveryCharge: "Delivery Charge",
    totalAmount: "Total Amount",
    codAmount: "Collect COD Amount",
    courierName: "Courier Name",
    notes: "Special Notes",
    preview: "Slip Preview",
    print: "Print Slip",
    downloadPdf: "Download PDF",
    sendEmail: "Email Slip",
    developerInfo: "Developer Info",
    collectCod: "COLLECT COD",
    thanks: "Thank you for shopping with us!",
    settings: "Settings",
    newOrder: "New Order",
    brandColor: "Brand Accent Color"
  },
  bn: {
    appTitle: "স্লিপক্র্যাফট",
    shopSetup: "শপ প্রোফাইল সেটআপ",
    shopName: "দোকানের নাম",
    shopLogo: "শপ লোগো",
    logoDesc: "লোগো আপলোড করুন (PNG/JPG)",
    contactInfo: "যোগাযোগের তথ্য",
    phone: "ফোন নম্বর",
    email: "ইমেইল অ্যাড্রেস",
    address: "ঠিকানা/ওয়ারহাউজ",
    social: "সোশ্যাল মিডিয়া এবং ওয়েব",
    facebook: "ফেসবুক পেজ লিংক",
    web: "ওয়েবসাইট লিংক",
    saveSettings: "প্রোফাইল সেভ করুন",
    orderForm: "গ্রাহক ও অর্ডারের বিবরণ",
    customerInfo: "গ্রাহকের তথ্য",
    name: "গ্রাহকের নাম",
    mobile: "মোবাইল নম্বর",
    deliveryAddress: "পুরো ঠিকানা",
    district: "জেলা",
    thana: "থানা",
    orderInfo: "অর্ডারের তথ্য",
    orderId: "অর্ডার আইডি / ট্র্যাকিং নম্বর",
    orderDate: "অর্ডারের তারিখ",
    productInfo: "পণ্যের বিবরণ",
    productName: "পণ্যের নাম/কোড",
    size: "সাইজ",
    color: "কালার",
    price: "মূল্য",
    qty: "পরিমাণ",
    addProduct: "আরও পণ্য যোগ করুন",
    paymentInfo: "পেমেন্ট ও কুরিয়ার",
    subTotal: "সাব টোটাল",
    discount: "ডিসকাউন্ট",
    advancePaid: "অগ্রিম প্রদান (অ্যাডভান্স)",
    deliveryCharge: "ডেলিভারি চার্জ",
    totalAmount: "মোট টাকার পরিমাণ",
    codAmount: "COD কালেকশন",
    courierName: "কুরিয়ারের নাম",
    notes: "বিশেষ নির্দেশিকা",
    preview: "স্লিপ প্রিভিউ",
    print: "প্রিন্ট করুন",
    downloadPdf: "পিডিএফ ডাউনলোড",
    sendEmail: "ইমেইল পাঠান",
    developerInfo: "ডেভেলপার তথ্য",
    collectCod: "ক্যাশ অন ডেলিভারি কালেকশন",
    thanks: "আমাদের থেকে কেনাকাটা করার জন্য ধন্যবাদ!",
    settings: "সেটিংস",
    newOrder: "নতুন কাস্টমার",
    brandColor: "ব্র্যান্ড কালার"
  }
};
