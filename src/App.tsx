/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  PlusCircle, 
  Printer, 
  Download, 
  Mail, 
  Trash2, 
  User, 
  Share2, 
  Smartphone, 
  MapPin, 
  ShoppingBag, 
  CreditCard, 
  Truck,
  Facebook,
  Globe,
  Instagram,
  Languages,
  CheckCircle2,
  Info,
  RefreshCcw,
  Copy,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JsBarcode from 'jsbarcode';
import html2pdf from 'html2pdf.js';
import { cn, generateOrderId } from './lib/utils';
import { ShopSettings, Order, Language, TRANSLATIONS, Product } from './types';

const STORAGE_KEY_SHOP = 'slipcraft_shop_settings';

const DEFAULT_SHOP: ShopSettings = {
  name: "SlipCraft Studio",
  logo: "",
  phone: "+880 1234 567890",
  email: "hello@slipcraft.com",
  address: "House 12, Road 5, Block B, Banani, Dhaka",
  facebook: "facebook.com/slipcraft",
  instagram: "instagram.com/slipcraft",
  website: "www.slipcraft.com",
  accentColor: "#f97316"
};

const DEFAULT_ORDER = (): Order => ({
  id: generateOrderId(),
  date: new Date().toISOString().split('T')[0],
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  district: "",
  thana: "",
  subTotal: 0,
  discount: 0,
  advancePaid: 0,
  deliveryCharge: 0,
  codAmount: 0,
  courierName: "",
  notes: "",
  products: [{ id: Math.random().toString(), name: "", size: "", color: "", price: 0, qty: 1 }]
});

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [shop, setShop] = useState<ShopSettings>(DEFAULT_SHOP);
  const [order, setOrder] = useState<Order>(DEFAULT_ORDER());
  const [activeTab, setActiveTab] = useState<'form' | 'settings'>('form');
  const [showPreview, setShowPreview] = useState(true);
  const slipRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const subTotal = order.products.reduce((acc, p) => acc + (p.price * p.qty), 0);
    const codAmount = Math.max(0, (subTotal + order.deliveryCharge) - (order.discount + order.advancePaid));
    
    if (order.subTotal !== subTotal || order.codAmount !== codAmount) {
      setOrder(prev => ({
        ...prev,
        subTotal,
        codAmount
      }));
    }
  }, [order.products, order.deliveryCharge, order.discount, order.advancePaid]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHOP);
    if (saved) {
      try {
        setShop(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  const saveShop = (newShop: ShopSettings) => {
    setShop(newShop);
    localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(newShop));
    setActiveTab('form');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!slipRef.current) return;
    const element = slipRef.current;
    const opt = {
      margin: 0,
      filename: `slip_${order.id}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a6' as const, orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(element).save();
  };

  const addProduct = () => {
    setOrder({
      ...order,
      products: [...order.products, { id: Math.random().toString(), name: "", size: "", color: "", price: 0, qty: 1 }]
    });
  };

  const removeProduct = (id: string) => {
    if (order.products.length <= 1) return;
    setOrder({
      ...order,
      products: order.products.filter(p => p.id !== id)
    });
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setOrder({
      ...order,
      products: order.products.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const resetOrder = () => {
    if (confirm("Are you sure you want to clear this order?")) {
      setOrder(DEFAULT_ORDER());
    }
  };

  const copyOrderInfo = () => {
    const text = `
Order ID: ${order.id}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Address: ${order.customerAddress}, ${order.thana}, ${order.district}
Products: ${order.products.map(p => `${p.name} (${p.size}/${p.color}) x${p.qty}`).join(', ')}
COD Amount: ৳ ${order.codAmount}
    `.trim();
    navigator.clipboard.writeText(text);
    alert("Order details copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FBFBFB] font-sans relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-200/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-purple-200/10 rounded-full blur-[80px]" 
        />
      </div>

      {/* Sidebar Navigation - Improved for Mobile */}
      <nav className="w-full md:w-24 bg-white/70 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-200 flex md:flex-col items-center py-3 px-4 md:py-8 gap-4 md:gap-8 no-print z-50 shadow-sm sticky top-0">
        <div className="p-3 md:p-4 bg-slate-900 rounded-xl md:rounded-2xl text-white shadow-xl shadow-slate-200 flex-shrink-0">
          <ShoppingBag size={20} className="md:w-6 md:h-6" />
        </div>
        
        <div className="flex md:flex-col items-center gap-2 md:gap-4 flex-1">
          <button 
            onClick={() => setActiveTab('form')}
            className={cn(
              "flex-1 md:flex-none p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex items-center md:flex-col justify-center gap-1.5 group",
              activeTab === 'form' ? "text-slate-900 bg-slate-100 shadow-inner" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <PlusCircle size={20} className={cn("md:w-6 md:h-6 transition-transform group-hover:scale-110", activeTab === 'form' && "scale-110")} />
            <span className="text-[10px] font-black uppercase tracking-tight hidden sm:block">{t.newOrder}</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex-1 md:flex-none p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex items-center md:flex-col justify-center gap-1.5 group",
              activeTab === 'settings' ? "text-slate-900 bg-slate-100 shadow-inner" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <Settings size={20} className={cn("md:w-6 md:h-6 transition-transform group-hover:rotate-45", activeTab === 'settings' && "rotate-45")} />
            <span className="text-[10px] font-black uppercase tracking-tight hidden sm:block">{t.settings}</span>
          </button>
        </div>

        <button 
          onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          className="p-2 md:p-4 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-black text-[10px] md:text-xs flex md:flex-col items-center gap-1"
        >
          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-slate-100 rounded-full md:mb-1">
             <Languages size={14} className="md:w-[18px] md:h-[18px]" />
          </div>
          <span className="hidden sm:inline">{lang === 'en' ? 'BN' : 'EN'}</span>
          <span className="sm:hidden">{lang === 'en' ? 'BN' : 'EN'}</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row h-screen overflow-hidden relative z-10">
        
        {/* Left Column: Form Inputs */}
        <section className="flex-1 overflow-y-auto no-print p-4 md:p-8 bg-mesh bg-grid-slate-200">
          <div className="max-w-3xl mx-auto space-y-8">
            <header className="flex items-end justify-between border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  Live Generator
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                  {activeTab === 'form' ? t.orderForm : t.shopSetup}
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  {activeTab === 'form' ? "Complete the fields below to create a high-fashion delivery slip" : "Configure your brand identity and style"}
                </p>
              </div>
              
              {activeTab === 'form' && (
                <div className="flex gap-2">
                  <button 
                    onClick={copyOrderInfo}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    title="Copy Order Info"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    onClick={resetOrder}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    title="Reset Form"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>
              )}
            </header>

            <AnimatePresence mode="wait">
              {activeTab === 'form' ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 pb-20"
                >
                  {/* Customer Info Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                      <User size={16} /> {t.customerInfo}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">{t.name}</label>
                        <input 
                          type="text" 
                          placeholder="MD EMON"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                          value={order.customerName}
                          onChange={(e) => setOrder({...order, customerName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">{t.mobile}</label>
                        <input 
                          type="text" 
                          placeholder="018XXXXXXXX"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                          value={order.customerPhone}
                          onChange={(e) => setOrder({...order, customerPhone: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">{t.deliveryAddress}</label>
                        <textarea 
                          placeholder="House, Road, Area..."
                          rows={2}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300 resize-none"
                          value={order.customerAddress}
                          onChange={(e) => setOrder({...order, customerAddress: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">{t.district}</label>
                        <input 
                          type="text" 
                          placeholder="Dhaka"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                          value={order.district}
                          onChange={(e) => setOrder({...order, district: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">{t.thana}</label>
                        <input 
                          type="text" 
                          placeholder="Banani"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                          value={order.thana}
                          onChange={(e) => setOrder({...order, thana: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Products Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        <ShoppingBag size={16} /> {t.productInfo}
                      </h2>
                      <button 
                        onClick={addProduct}
                        className="text-xs font-medium flex items-center gap-1 text-slate-900 border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition-all font-mono"
                      >
                        <PlusCircle size={14} /> {t.addProduct.toUpperCase()}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {order.products.map((p, idx) => (
                        <div key={p.id} className="grid grid-cols-12 gap-2 p-3 bg-slate-50 rounded-xl relative group">
                          <div className="col-span-12 md:col-span-4 space-y-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase">{t.productName}</label>
                            <input 
                              type="text" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium"
                              value={p.name}
                              onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="col-span-3 md:col-span-2 space-y-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase">{t.size}</label>
                            <input 
                              type="text" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium"
                              value={p.size}
                              onChange={(e) => updateProduct(p.id, 'size', e.target.value)}
                            />
                          </div>
                          <div className="col-span-3 md:col-span-2 space-y-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase">{t.color}</label>
                            <input 
                              type="text" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium"
                              value={p.color}
                              onChange={(e) => updateProduct(p.id, 'color', e.target.value)}
                            />
                          </div>
                          <div className="col-span-3 md:col-span-2 space-y-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase">{t.price}</label>
                            <input 
                              type="number" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium"
                              value={p.price || ''}
                              onChange={(e) => updateProduct(p.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2 md:col-span-1 space-y-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase">{t.qty}</label>
                            <input 
                              type="number" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium"
                              value={p.qty}
                              onChange={(e) => updateProduct(p.id, 'qty', parseInt(e.target.value))}
                            />
                          </div>
                          <button 
                            onClick={() => removeProduct(p.id)}
                            className="col-span-1 flex items-center justify-end text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 font-sans">
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                      <CreditCard size={16} /> {t.paymentInfo}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t.orderId}</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none text-sm font-bold"
                          placeholder="SL-123456 or Courier Tracking"
                          value={order.id}
                          onChange={(e) => setOrder({...order, id: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t.subTotal}</label>
                        <p className="text-sm font-black">৳ {order.subTotal.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t.discount}</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none text-sm font-bold"
                          value={order.discount || ''}
                          onChange={(e) => setOrder({...order, discount: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t.advancePaid}</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none text-sm font-bold"
                          value={order.advancePaid || ''}
                          onChange={(e) => setOrder({...order, advancePaid: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t.deliveryCharge}</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none text-sm font-bold"
                          value={order.deliveryCharge || ''}
                          onChange={(e) => setOrder({...order, deliveryCharge: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t.courierName}</label>
                        <select 
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none text-sm font-bold"
                          value={order.courierName}
                          onChange={(e) => setOrder({...order, courierName: e.target.value})}
                        >
                          <option value="">Select Courier</option>
                          <option value="Pathao">Pathao</option>
                          <option value="Steadfast">Steadfast</option>
                          <option value="RedX">RedX</option>
                          <option value="E-desh">E-desh</option>
                          <option value="Paperfly">Paperfly</option>
                          <option value="SA Paribahan">SA Paribahan</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{t.codAmount}</label>
                        <p className="text-lg font-black text-white">৳ {order.codAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 mt-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">{t.notes}</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm"
                        rows={2}
                        placeholder="e.g. Check carefully before delivery"
                        value={order.notes}
                        onChange={(e) => setOrder({...order, notes: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Shop Setup Card */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div 
                        className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-50 transition-all relative"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        {shop.logo ? (
                          <img src={shop.logo} className="w-full h-full object-contain" alt="Logo" />
                        ) : (
                          <div className="text-slate-400 flex flex-col items-center gap-1">
                            <Smartphone size={24} />
                            <span className="text-[10px] font-bold uppercase">{t.shopLogo}</span>
                          </div>
                        )}
                        <input 
                          id="logo-upload" 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setShop({...shop, logo: re.target?.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-400">{t.logoDesc}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.shopName}</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                            value={shop.name}
                            onChange={(e) => setShop({...shop, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.phone}</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                            value={shop.phone}
                            onChange={(e) => setShop({...shop, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.email}</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                            value={shop.email}
                            onChange={(e) => setShop({...shop, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.address}</label>
                          <textarea 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg resize-none"
                            rows={3}
                            value={shop.address}
                            onChange={(e) => setShop({...shop, address: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.brandColor}</label>
                          <div className="flex gap-2">
                            {['#f97316', '#2563eb', '#16a34a', '#dc2626', '#1a1a1a', '#9333ea'].map(c => (
                              <button 
                                key={c}
                                onClick={() => setShop({...shop, accentColor: c})}
                                className={cn(
                                  "w-8 h-8 rounded-full border-2 transition-all",
                                  shop.accentColor === c ? "border-slate-900 scale-110 shadow-lg" : "border-transparent"
                                )}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                            <input 
                              type="color" 
                              className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none"
                              value={shop.accentColor}
                              onChange={(e) => setShop({...shop, accentColor: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.social}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                          <Facebook size={18} className="text-blue-600" />
                          <input 
                            type="text" 
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm flex-1"
                            placeholder="facebook.com/page"
                            value={shop.facebook}
                            onChange={(e) => setShop({...shop, facebook: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                          <Globe size={18} className="text-slate-400" />
                          <input 
                            type="text" 
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm flex-1"
                            placeholder="website.com"
                            value={shop.website}
                            onChange={(e) => setShop({...shop, website: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                          <Instagram size={18} className="text-pink-600" />
                          <input 
                            type="text" 
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm flex-1"
                            placeholder="instagram.com/handle"
                            value={shop.instagram}
                            onChange={(e) => setShop({...shop, instagram: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => saveShop(shop)}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold tracking-widest shadow-xl shadow-slate-900/10 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      {t.saveSettings.toUpperCase()}
                    </button>

                    {/* Developer Info Section */}
                    <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Developed By</h3>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-3">
                          <h4 className="text-lg font-black text-slate-900">MD EMON</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Focused on modern UI/UX and seamless performance. 
                            Your feedback and support keep us motivated to improve.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <a href="mailto:emonbinhadi@gmail.com" className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"><Mail size={14} /> emonbinhadi@gmail.com</a>
                          <a href="https://wa.me/8801823898707" className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"><Smartphone size={14} /> +8801823898707</a>
                          <div className="flex gap-4 mt-2">
                            <a href="https://facebook.com/m.emon.k11" className="p-2 bg-white rounded-lg shadow-sm hover:scale-110 transition-transform"><Facebook size={14} /></a>
                            <a href="https://instagram.com/m.emon.k" className="p-2 bg-white rounded-lg shadow-sm hover:scale-110 transition-transform"><Instagram size={14} /></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Right Column: Real-time Preview */}
        <section className="hidden lg:flex w-[480px] bg-slate-100 border-l border-slate-200 overflow-y-auto no-print">
          <div className="p-10 w-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">{t.preview}</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-slate-600">
                  <Printer size={18} />
                </button>
                <button onClick={handleDownloadPdf} className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-slate-600">
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Slip Container */}
            <div 
              ref={slipRef}
              className="bg-white w-full rounded-sm shadow-2xl overflow-hidden font-sans slip-content origin-top transition-transform duration-500"
              style={{ minHeight: '600px' }}
            >
              <SlipContent shop={shop} order={order} t={t} lang={lang} />
            </div>

            {/* Float Action Buttons for Mobile Simulation */}
            <div className="bg-slate-900 bg-opacity-5 rounded-2xl p-6 border border-slate-900/5 backdrop-blur-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-white">
                  <Info size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Developer Info</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    Designed by MD EMON.<br/>
                    Build modern slips for your brand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Preview Toggle */}
        <div className="lg:hidden fixed bottom-6 right-6 no-print z-50">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center"
          >
            {showPreview ? <User size={24} /> : <Share2 size={24} />}
          </button>
        </div>

        {showPreview && (
          <div className="lg:hidden fixed inset-0 z-40 bg-white overflow-y-auto no-print">
            <div className="p-4 flex justify-between items-center bg-slate-50 border-b">
              <h2 className="font-bold">{t.preview}</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 bg-white rounded-lg shadow-sm"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white border rounded shadow-lg overflow-hidden">
                <SlipContent shop={shop} order={order} t={t} lang={lang} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={handlePrint} className="py-3 bg-white border rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                  <Printer size={18} /> {t.print}
                </button>
                <button onClick={handleDownloadPdf} className="py-3 bg-white border rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                  <Download size={18} /> {t.downloadPdf}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Hidden Print Only Version */}
      <div className="print-only">
        <SlipContent shop={shop} order={order} t={t} lang={lang} />
      </div>
    </div>
  );
}

function SlipContent({ shop, order, t, lang }: { shop: ShopSettings, order: Order, t: any, lang: Language }) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && order.id) {
      try {
        JsBarcode(barcodeRef.current, order.id, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: false,
          margin: 0,
          background: "transparent",
          lineColor: "#111827"
        });
      } catch (e) {
        console.error("Barcode generation failed", e);
      }
    }
  }, [order.id]);

  return (
    <div className="p-0 text-slate-900 flex flex-col h-full bg-white relative overflow-hidden font-sans border border-slate-100">
      {/* Premium Fashion Header with Texture */}
      <div className="bg-slate-900 text-white px-8 py-12 flex justify-between items-center relative overflow-hidden overflow-hidden">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="relative z-10">
          {shop.logo ? (
            <img src={shop.logo} className="h-20 w-auto mb-4 invert brightness-200" alt="Logo" />
          ) : (
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{shop.name}</h1>
              <div className="h-1 w-12 bg-white/20"></div>
            </div>
          )}
          <div className="space-y-1 mt-4 opacity-70">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase leading-tight">{shop.address}</p>
            <p className="text-[10px] font-medium tracking-widest">{shop.phone} | {shop.email}</p>
          </div>
        </div>
        
        <div className="text-right relative z-10 flex flex-col items-end gap-2 text-white">
           <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 inline-block">
             <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">Generated At</span>
             <span className="text-xs font-black">{order.date}</span>
           </div>
           <div className="mt-2 group">
             <h2 className="text-5xl font-black opacity-10 uppercase tracking-tighter select-none leading-none group-hover:opacity-20 transition-opacity">Slip</h2>
             <p className="text-[9px] font-black tracking-[0.3em] uppercase mt-[-8px] mr-1 opacity-40">Original Invoice</p>
           </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Body */}
      <div className="p-8 space-y-10 flex-1 relative">
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
          <h2 className="text-[200px] font-black uppercase rotate-[-30deg] whitespace-nowrap">{shop.name}</h2>
        </div>

        {/* Customer & Info Grid */}
        <div className="grid grid-cols-12 gap-8 items-start relative z-10">
          <div className="col-span-7 space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 block">Consignee Details</span>
                <h3 className="text-3xl font-black uppercase text-slate-900 leading-none mb-3 tracking-tight">{order.customerName || "No Name Provided"}</h3>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <Smartphone size={15} className="text-slate-400" /> {order.customerPhone || "01XXXXXXXXX"}
                  </p>
                  <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <MapPin size={15} className="text-slate-400" /> {order.district}, {order.thana}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Shipping Address</span>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  {order.customerAddress || "No address provided. Please check with customer."}
                </p>
              </div>
            </div>
            
            {order.notes && (
              <div className="p-4 border-l-4 border-slate-900 bg-slate-900/5 rounded-r-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-slate-900" />
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Special Handling</span>
                </div>
                <p className="text-[12px] font-bold italic text-slate-800 leading-relaxed">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="col-span-5 flex flex-col items-end gap-8 text-right">
             <div className="w-full max-w-[180px]">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Security Barcode</span>
               <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-sm inline-block w-full">
                 <svg ref={barcodeRef} className="w-full h-auto"></svg>
                 <div className="flex items-center justify-between mt-2 border-t border-slate-50 pt-2 px-1">
                   <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Order ID</p>
                   <p className="text-[9px] font-black tracking-widest text-slate-900">#{order.id}</p>
                 </div>
               </div>
             </div>
             
             <div className="w-full space-y-4">
               <div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Fulfillment</span>
                 <div className="flex items-center justify-end gap-3 text-slate-900 bg-slate-50 py-2 px-4 rounded-lg border border-slate-100 inline-flex">
                   <Truck size={16} className="opacity-60" />
                   <span className="text-[11px] font-black uppercase italic tracking-widest">{order.courierName || "Local"}</span>
                 </div>
               </div>

               <div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Payment Priority</span>
                 <div className={cn(
                   "px-4 py-2 rounded-lg border inline-flex items-center gap-2",
                   order.codAmount > 0 ? "bg-orange-50 border-orange-100 text-orange-700" : "bg-green-50 border-green-100 text-green-700"
                 )}>
                   <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", order.codAmount > 0 ? "bg-orange-500" : "bg-green-500")} />
                   <span className="text-[10px] font-black uppercase tracking-widest">
                     {order.codAmount > 0 ? "Collect Cash" : "Paid in Full"}
                   </span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Product Table with Better Styling */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Package Contents</span>
            <div className="flex-1 h-[1px] bg-slate-100"></div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-[3px] border-slate-900">
                <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{t.productName}</th>
                <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">{t.size} / {t.color}</th>
                <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">{t.price}</th>
                <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-right">{t.qty}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.products.map((p, idx) => (
                <tr key={idx} className="group">
                  <td className="py-5">
                    <p className="text-xs font-black uppercase text-slate-900 leading-tight">{p.name || 'Untitled Item'}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">SKU: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </td>
                  <td className="py-5 text-xs font-black text-center text-slate-600 uppercase">
                    {p.size || 'N/A'} <span className="opacity-20 px-1">|</span> {p.color || 'N/A'}
                  </td>
                  <td className="py-5 text-xs font-black text-center text-slate-900">
                    ৳ {p.price?.toLocaleString()}
                  </td>
                  <td className="py-5 text-xs font-black text-right">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100">
                      {p.qty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Recap Section */}
        <div className="flex justify-end pt-6 relative z-10">
          <div className="w-full max-w-[320px] space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>{t.subTotal}</span>
              <span className="text-slate-900">৳ {order.subTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>{t.deliveryCharge}</span>
              <span className="text-slate-900 font-black">+ ৳ {order.deliveryCharge.toLocaleString()}</span>
            </div>
            
            {(order.discount > 0 || order.advancePaid > 0) && <div className="h-[1px] bg-slate-100 my-2"></div>}
            
            {order.discount > 0 && (
              <div className="flex justify-between items-center text-[10px] font-black text-orange-600 uppercase tracking-widest">
                <span>Special {t.discount}</span>
                <span>- ৳ {order.discount.toLocaleString()}</span>
              </div>
            )}
            {order.advancePaid > 0 && (
              <div className="flex justify-between items-center text-[10px] font-black text-blue-600 uppercase tracking-widest">
                <span>{t.advancePaid}</span>
                <span>- ৳ {order.advancePaid.toLocaleString()}</span>
              </div>
            )}
            
            <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 block">{t.collectCod}</span>
                <span className="text-8 font-black uppercase text-slate-900 tracking-tighter">Total Due</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black italic tracking-tighter" style={{ color: shop.accentColor }}>৳ {order.codAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Branding Footer */}
      <footer className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="relative z-10 flex gap-10">
          <div className="space-y-2">
            <p className="text-[10px] font-black italic text-white/40 uppercase tracking-[0.3em]">{t.thanks}</p>
            <div className="flex gap-4 opacity-100">
               {shop.facebook && <Facebook size={16} className="text-white hover:text-orange-400 transition-colors" />}
               {shop.instagram && <Instagram size={16} className="text-white hover:text-orange-400 transition-colors" />}
               {shop.website && <Globe size={16} className="text-white hover:text-orange-400 transition-colors" />}
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10 hidden sm:block"></div>
          <div className="hidden sm:block space-y-1">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Support Line</p>
            <p className="text-[11px] font-black tracking-widest">{shop.phone}</p>
          </div>
        </div>

        <div className="relative z-10 text-right">
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Authentic Slip</p>
           <div className="flex h-1.5 w-32 md:w-56 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-2/3 bg-white/10"></div>
              <div className="h-full w-1/3" style={{ backgroundColor: shop.accentColor }}></div>
           </div>
        </div>
      </footer>
    </div>
  );
}

