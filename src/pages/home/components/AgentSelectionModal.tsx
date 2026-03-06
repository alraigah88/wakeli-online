
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import { useAuth } from '../../../contexts/AuthContext';
import AuthModal from '../../../components/feature/AuthModal';

interface AgentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: 'trial' | 'agent' | 'corporate';
}

const agentAvatars: Record<string, string> = {
  reem: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png',
  ahmed: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png',
  sara: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png',
  khalid: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png',
  nora: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/a922778b168be8b83e02c082538079fd.png',
  omar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/fa141410ac8972062d76be8f0ec890b4.png',
};

type ViewState = 'carousel' | 'detail' | 'cart' | 'checkout';

interface AgentData {
  id: string;
  name: string;
  role: string;
  skills: string[];
  price: number;
  color: string;
  emoji: string;
}

export default function AgentSelectionModal({
  isOpen,
  onClose,
  packageType,
}: AgentSelectionModalProps) {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const isArabic = i18n.language === 'ar';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('carousel');
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartItems, setCartItems] = useState<{ agentId: string; skills: string[] }[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  const agents: AgentData[] = [
    {
      id: 'reem',
      name: t('agentsList.reem.name'),
      role: t('agentsList.reem.role'),
      skills: t('agentsList.reem.tasks', { returnObjects: true }) as string[],
      price: 150,
      color: '#e91e8c',
      emoji: '\u{1F4E2}',
    },
    {
      id: 'ahmed',
      name: t('agentsList.ahmed.name'),
      role: t('agentsList.ahmed.role'),
      skills: t('agentsList.ahmed.tasks', { returnObjects: true }) as string[],
      price: 200,
      color: '#7c3aed',
      emoji: '\u270D\uFE0F',
    },
    {
      id: 'sara',
      name: t('agentsList.sara.name'),
      role: t('agentsList.sara.role'),
      skills: t('agentsList.sara.tasks', { returnObjects: true }) as string[],
      price: 180,
      color: '#0ea5e9',
      emoji: '\u{1F4AC}',
    },
    {
      id: 'khalid',
      name: t('agentsList.khalid.name'),
      role: t('agentsList.khalid.role'),
      skills: t('agentsList.khalid.tasks', { returnObjects: true }) as string[],
      price: 220,
      color: '#10b981',
      emoji: '\u{1F4CA}',
    },
    {
      id: 'nora',
      name: t('agentsList.nora.name'),
      role: t('agentsList.nora.role'),
      skills: t('agentsList.nora.tasks', { returnObjects: true }) as string[],
      price: 170,
      color: '#f59e0b',
      emoji: '\u{1F5C2}\uFE0F',
    },
    {
      id: 'omar',
      name: t('agentsList.omar.name'),
      role: t('agentsList.omar.role'),
      skills: t('agentsList.omar.tasks', { returnObjects: true }) as string[],
      price: 190,
      color: '#ef4444',
      emoji: '\u{1F4BB}',
    },
  ];

  const currentAgent = agents[activeIndex];

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % agents.length);
    setSelectedSkill('');
  }, [agents.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + agents.length) % agents.length);
    setSelectedSkill('');
  }, [agents.length]);

  const getRelativeIndex = (offset: number) => {
    return (activeIndex + offset + agents.length) % agents.length;
  };

  const isAgentInCart = (agentId: string) => cartItems.some((item) => item.agentId === agentId);

  const addToCart = (agentId: string, skills: string[]) => {
    if (isAgentInCart(agentId)) return;
    if (packageType === 'trial') {
      setCartItems([{ agentId, skills }]);
    } else {
      setCartItems((prev) => [...prev, { agentId, skills }]);
    }
  };

  const removeFromCart = (agentId: string) => {
    setCartItems((prev) => prev.filter((item) => item.agentId !== agentId));
  };

  const calculateTotal = () => {
    if (packageType === 'trial') return 25;
    return cartItems.reduce((total, item) => {
      const agent = agents.find((a) => a.id === item.agentId);
      return total + (agent?.price || 0);
    }, 0);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setViewState('checkout');
  };

  const handleConfirmPurchase = () => {
    setViewState('carousel');
    setCartItems([]);
    onClose();
  };

  const handleSelectAgent = () => {
    const agent = currentAgent;
    if (packageType === 'trial') {
      if (!selectedSkill) return;
      addToCart(agent.id, [selectedSkill]);
      setViewState('cart');
    } else {
      addToCart(agent.id, agent.skills);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-6xl max-h-[94vh] overflow-y-auto rounded-2xl shadow-2xl ${
                isDark ? 'bg-[#2a2458]' : 'bg-white'
              }`}
            >
              {/* Top Bar */}
              <div
                className={`sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 py-4 border-b backdrop-blur-xl ${
                  isDark
                    ? 'bg-[#2a2458]/95 border-[#5a5490]/30'
                    : 'bg-white/95 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {viewState !== 'carousel' && (
                    <button
                      onClick={() => {
                        if (viewState === 'detail') setViewState('carousel');
                        else if (viewState === 'cart') setViewState('carousel');
                        else if (viewState === 'checkout') setViewState('cart');
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <i className={`ri-arrow-${isArabic ? 'right' : 'left'}-line text-xl`}></i>
                    </button>
                  )}
                  <div>
                    <h2
                      className={`text-xl md:text-2xl font-bold font-mono ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {viewState === 'carousel' &&
                        (packageType === 'trial'
                          ? t('purchase.selectAgent')
                          : packageType === 'agent'
                          ? t('purchase.selectAgents')
                          : t('purchase.corporate'))}
                      {viewState === 'detail' && currentAgent?.name}
                      {viewState === 'cart' && (isArabic ? '\u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A' : 'Shopping Cart')}
                      {viewState === 'checkout' && t('purchase.checkout')}
                    </h2>
                    <p className={`text-sm font-mono mt-0.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                      {viewState === 'carousel' &&
                        (packageType === 'trial'
                          ? t('purchase.trialDesc')
                          : packageType === 'agent'
                          ? t('purchase.agentDesc')
                          : t('purchase.corporateDesc'))}
                      {viewState === 'detail' && currentAgent?.role}
                      {viewState === 'cart' && (isArabic ? '\u0631\u0627\u062C\u0639 \u0627\u062E\u062A\u064A\u0627\u0631\u0627\u062A\u0643' : 'Review your selections')}
                      {viewState === 'checkout' && t('purchase.reviewOrder')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {viewState !== 'checkout' && cartItems.length > 0 && (
                    <button
                      onClick={() => setViewState('cart')}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        isDark
                          ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30'
                          : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      <i className="ri-shopping-cart-2-line text-lg"></i>
                      <span>{isArabic ? '\u0627\u0644\u0633\u0644\u0629' : 'Cart'}</span>
                      <span className="absolute -top-1.5 -end-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-teal-500 text-white text-[11px] font-bold">
                        {cartItems.length}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* ===== CORPORATE VIEW ===== */}
                {packageType === 'corporate' && viewState === 'carousel' && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <i className="ri-building-line text-5xl text-amber-500"></i>
                    </div>
                    <h3 className={`text-3xl font-bold font-mono mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('purchase.corporateTitle')}
                    </h3>
                    <p className={`text-lg font-mono mb-8 max-w-lg mx-auto ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                      {t('purchase.corporateContact')}
                    </p>
                    <a
                      href="mailto:corporate@wakilak.ai"
                      className="inline-block px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-mono font-bold text-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {t('purchase.contactUs')}
                    </a>
                  </div>
                )}

                {/* ===== CAROUSEL VIEW ===== */}
                {packageType !== 'corporate' && viewState === 'carousel' && (
                  <div className="flex flex-col items-center">
                    {/* Carousel Container */}
                    <div className="relative w-full flex items-center justify-center py-6" style={{ minHeight: '480px' }}>
                      
                      {/* Left Arrow */}
                      <button
                        onClick={isArabic ? goNext : goPrev}
                        className={`absolute z-30 w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                          isDark
                            ? 'bg-[#3a3568]/90 hover:bg-[#4a4578] text-white border border-[#5a5490]/50'
                            : 'bg-white/95 hover:bg-white text-gray-700 border border-gray-200'
                        }`}
                        style={{ [isArabic ? 'right' : 'left']: '16px', top: '50%', transform: 'translateY(-50%)' }}
                      >
                        <i className={`ri-arrow-${isArabic ? 'right' : 'left'}-s-line text-3xl`}></i>
                      </button>

                      {/* Right Arrow */}
                      <button
                        onClick={isArabic ? goPrev : goNext}
                        className={`absolute z-30 w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                          isDark
                            ? 'bg-[#3a3568]/90 hover:bg-[#4a4578] text-white border border-[#5a5490]/50'
                            : 'bg-white/95 hover:bg-white text-gray-700 border border-gray-200'
                        }`}
                        style={{ [isArabic ? 'left' : 'right']: '16px', top: '50%', transform: 'translateY(-50%)' }}
                      >
                        <i className={`ri-arrow-${isArabic ? 'left' : 'right'}-s-line text-3xl`}></i>
                      </button>

                      {/* Agents Carousel */}
                      <div className="flex items-center justify-center gap-0 relative" style={{ width: '100%', maxWidth: '900px' }}>
                        
                        {/* Far Left Agent (small) */}
                        <CarouselCard
                          agent={agents[getRelativeIndex(-2)]}
                          size="tiny"
                          isDark={isDark}
                          isArabic={isArabic}
                          inCart={isAgentInCart(agents[getRelativeIndex(-2)].id)}
                          onClick={() => { setActiveIndex(getRelativeIndex(-2)); setSelectedSkill(''); }}
                        />

                        {/* Left Agent (medium) */}
                        <CarouselCard
                          agent={agents[getRelativeIndex(-1)]}
                          size="medium"
                          isDark={isDark}
                          isArabic={isArabic}
                          inCart={isAgentInCart(agents[getRelativeIndex(-1)].id)}
                          onClick={() => { setActiveIndex(getRelativeIndex(-1)); setSelectedSkill(''); }}
                        />

                        {/* Center Agent (large - active) */}
                        <CarouselCard
                          agent={currentAgent}
                          size="large"
                          isDark={isDark}
                          isArabic={isArabic}
                          inCart={isAgentInCart(currentAgent.id)}
                          onClick={() => {}}
                          isActive
                        />

                        {/* Right Agent (medium) */}
                        <CarouselCard
                          agent={agents[getRelativeIndex(1)]}
                          size="medium"
                          isDark={isDark}
                          isArabic={isArabic}
                          inCart={isAgentInCart(agents[getRelativeIndex(1)].id)}
                          onClick={() => { setActiveIndex(getRelativeIndex(1)); setSelectedSkill(''); }}
                        />

                        {/* Far Right Agent (small) */}
                        <CarouselCard
                          agent={agents[getRelativeIndex(2)]}
                          size="tiny"
                          isDark={isDark}
                          isArabic={isArabic}
                          inCart={isAgentInCart(agents[getRelativeIndex(2)].id)}
                          onClick={() => { setActiveIndex(getRelativeIndex(2)); setSelectedSkill(''); }}
                        />
                      </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex items-center gap-2 mb-8">
                      {agents.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setActiveIndex(i); setSelectedSkill(''); }}
                          className={`rounded-full transition-all duration-300 cursor-pointer ${
                            i === activeIndex ? 'w-8 h-3' : 'w-3 h-3 hover:scale-125'
                          }`}
                          style={{
                            backgroundColor: i === activeIndex ? currentAgent.color : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                          }}
                        />
                      ))}
                    </div>

                    {/* Agent Details Section Below Carousel */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentAgent.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className={`w-full max-w-3xl rounded-2xl border p-6 md:p-8 ${
                          isDark ? 'bg-[#3a3568]/40 border-[#5a5490]/30' : 'bg-gray-50/80 border-gray-200'
                        }`}
                      >
                        {/* Agent Name & Role */}
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                            style={{ backgroundColor: `${currentAgent.color}15` }}
                          >
                            {currentAgent.emoji}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-mono text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {currentAgent.name}
                            </h3>
                            <p className="font-mono text-base" style={{ color: currentAgent.color }}>
                              {currentAgent.role}
                            </p>
                          </div>
                          {/* Price */}
                          <div className={`text-end`}>
                            <p className={`font-mono text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {packageType === 'trial' ? '25' : currentAgent.price}
                            </p>
                            <p className={`font-mono text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                              {t('pricing.currency')} {packageType === 'trial' ? '/ ' + (isArabic ? '\u0633\u0627\u0639\u062A\u064A\u0646' : '2 hours') : '/ ' + (isArabic ? '\u0634\u0647\u0631\u064A\u0627\u064B' : 'monthly')}
                            </p>
                          </div>
                        </div>

                        {/* Skills Title */}
                        <h4 className={`font-mono text-base font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-list-check-2 text-lg" style={{ color: currentAgent.color }}></i>
                          </div>
                          {packageType === 'trial'
                            ? isArabic ? '\u0627\u062E\u062A\u0631 \u0645\u0647\u0627\u0631\u0629 \u0648\u0627\u062D\u062F\u0629' : 'Select One Skill'
                            : isArabic ? '\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629' : 'All Available Skills'}
                        </h4>

                        {/* Skills List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                          {Array.isArray(currentAgent.skills) && currentAgent.skills.map((skill, i) => (
                            <motion.div
                              key={`${currentAgent.id}-${i}`}
                              initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              onClick={() => packageType === 'trial' && setSelectedSkill(skill)}
                              className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                                packageType === 'trial' ? 'cursor-pointer' : ''
                              } ${
                                packageType === 'trial' && selectedSkill === skill
                                  ? isDark
                                    ? 'bg-teal-500/15 border-2 border-teal-400/40'
                                    : 'bg-teal-50 border-2 border-teal-300'
                                  : isDark
                                  ? 'bg-[#2a2458]/60 hover:bg-[#2a2458]/90 border-2 border-transparent'
                                  : 'bg-white hover:bg-gray-100 border-2 border-transparent'
                              }`}
                            >
                              {packageType === 'trial' ? (
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                                    selectedSkill === skill
                                      ? 'border-teal-500 bg-teal-500'
                                      : isDark
                                      ? 'border-white/20'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {selectedSkill === skill && <i className="ri-check-line text-white text-sm"></i>}
                                </div>
                              ) : (
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${currentAgent.color}15` }}
                                >
                                  <i className="ri-checkbox-circle-fill text-base" style={{ color: currentAgent.color }}></i>
                                </div>
                              )}
                              <span className={`font-mono text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                                {skill}
                              </span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Status & Action */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className={`flex items-center gap-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="font-mono text-sm">
                              {isArabic ? '\u0645\u062A\u0627\u062D \u0627\u0644\u0622\u0646 \u2022 \u062C\u0627\u0647\u0632 \u0644\u0644\u0639\u0645\u0644 24/7' : 'Available now \u2022 Ready 24/7'}
                            </span>
                          </div>

                          {isAgentInCart(currentAgent.id) ? (
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-base ${
                                isDark ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-50 text-teal-700'
                              }`}>
                                <i className="ri-check-double-line text-xl"></i>
                                <span className="font-medium">{isArabic ? '\u062A\u0645 \u0627\u0644\u0625\u0636\u0627\u0641\u0629' : 'Added'}</span>
                              </div>
                              <button
                                onClick={() => removeFromCart(currentAgent.id)}
                                className="px-4 py-3 rounded-xl font-mono text-sm text-red-400 hover:bg-red-500/10 border border-red-400/30 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                {isArabic ? '\u0625\u0632\u0627\u0644\u0629' : 'Remove'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={handleSelectAgent}
                              disabled={packageType === 'trial' && !selectedSkill}
                              className={`px-8 py-3.5 rounded-xl font-mono font-bold text-base transition-all cursor-pointer whitespace-nowrap ${
                                packageType === 'trial' && !selectedSkill
                                  ? isDark
                                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-xl hover:shadow-teal-500/25 hover:scale-105'
                              }`}
                            >
                              <i className="ri-shopping-cart-2-line text-lg me-2"></i>
                              {packageType === 'trial'
                                ? isArabic ? '\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629 (25 \u0631.\u0645)' : 'Add to Cart (25 SAR)'
                                : isArabic ? `\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629 (${currentAgent.price} \u0631.\u0645)` : `Add to Cart (${currentAgent.price} SAR)`}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* ===== CART VIEW ===== */}
                {viewState === 'cart' && (
                  <div>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <i className={`ri-shopping-cart-2-line text-4xl ${isDark ? 'text-white/30' : 'text-gray-300'}`}></i>
                        </div>
                        <p className={`font-mono text-lg ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                          {isArabic ? '\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0631\u063A\u0629' : 'Cart is empty'}
                        </p>
                        <button
                          onClick={() => setViewState('carousel')}
                          className={`mt-4 px-6 py-2.5 rounded-xl font-mono text-sm cursor-pointer whitespace-nowrap ${
                            isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isArabic ? '\u062A\u0635\u0641\u062D \u0627\u0644\u0648\u0643\u0644\u0627\u0621' : 'Browse Agents'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => {
                          const agent = agents.find((a) => a.id === item.agentId);
                          if (!agent) return null;
                          return (
                            <div
                              key={item.agentId}
                              className={`flex items-start gap-4 p-5 rounded-2xl border ${
                                isDark ? 'bg-[#3a3568]/40 border-[#5a5490]/30' : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                  src={agentAvatars[agent.id]}
                                  alt={agent.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{agent.emoji}</span>
                                  <h4 className={`font-mono font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {agent.name}
                                  </h4>
                                </div>
                                <p className="font-mono text-sm mb-2" style={{ color: agent.color }}>
                                  {agent.role}
                                </p>
                                {packageType === 'trial' && item.skills.length > 0 && (
                                  <div className={`text-sm font-mono ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                                    {isArabic ? '\u0627\u0644\u0645\u0647\u0627\u0631\u0629:' : 'Skill:'} {item.skills[0]}
                                  </div>
                                )}
                                {packageType === 'agent' && (
                                  <div className={`text-sm font-mono ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                                    {isArabic ? '\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A' : 'All skills'} ({agent.skills.length})
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`font-mono font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {packageType === 'trial' ? 25 : agent.price} {t('pricing.currency')}
                                </span>
                                <button
                                  onClick={() => removeFromCart(agent.id)}
                                  className="w-9 h-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                >
                                  <i className="ri-delete-bin-line text-lg"></i>
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Cart Total */}
                        <div
                          className={`flex items-center justify-between p-5 rounded-2xl border-2 ${
                            isDark ? 'bg-[#3a3568]/60 border-teal-500/20' : 'bg-teal-50/50 border-teal-200'
                          }`}
                        >
                          <div>
                            <p className={`font-mono text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                              {t('purchase.total')}
                            </p>
                            <p className={`font-mono text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {calculateTotal()} {t('pricing.currency')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setViewState('carousel')}
                              className={`px-5 py-3 rounded-xl font-mono text-sm font-medium cursor-pointer whitespace-nowrap ${
                                isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {isArabic ? '\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0632\u064A\u062F' : 'Add More'}
                            </button>
                            <button
                              onClick={handleProceedToCheckout}
                              className="px-8 py-3 rounded-xl font-mono text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-xl hover:shadow-teal-500/25 transition-all cursor-pointer whitespace-nowrap"
                            >
                              {t('purchase.proceed')}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ===== CHECKOUT VIEW ===== */}
                {viewState === 'checkout' && (
                  <div className="max-w-2xl mx-auto">
                    <div className={`p-6 rounded-2xl mb-6 ${isDark ? 'bg-[#3a3568]/60' : 'bg-gray-50'}`}>
                      <h3 className={`font-mono text-lg font-bold mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {t('purchase.orderSummary')}
                      </h3>
                      {cartItems.map((item) => {
                        const agent = agents.find((a) => a.id === item.agentId);
                        if (!agent) return null;
                        return (
                          <div
                            key={item.agentId}
                            className={`flex items-center justify-between py-4 border-b ${
                              isDark ? 'border-white/10' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden">
                                <img src={agentAvatars[agent.id]} alt={agent.name} className="w-full h-full object-cover object-top" />
                              </div>
                              <div>
                                <p className={`font-mono font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {agent.emoji} {agent.name}
                                </p>
                                <p className={`font-mono text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                                  {agent.role}
                                </p>
                                {packageType === 'trial' && item.skills.length > 0 && (
                                  <p className={`font-mono text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                                    {t('purchase.skill')}: {item.skills[0]}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className={`font-mono font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {packageType === 'trial' ? 25 : agent.price} {t('pricing.currency')}
                            </p>
                          </div>
                        );
                      })}
                      <div className="flex justify-between items-center pt-5">
                        <p className={`font-mono text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('purchase.total')}
                        </p>
                        <p className={`font-mono text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {calculateTotal()} {t('pricing.currency')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setViewState('cart')}
                        className={`flex-1 py-3.5 rounded-xl font-mono font-medium text-base cursor-pointer whitespace-nowrap ${
                          isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                      >
                        {t('purchase.back')}
                      </button>
                      <button
                        onClick={handleConfirmPurchase}
                        className="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-mono font-bold text-base hover:shadow-xl hover:shadow-teal-500/25 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {t('purchase.confirm')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}

/* ===== Carousel Card Component ===== */
interface CarouselCardProps {
  agent: AgentData;
  size: 'tiny' | 'medium' | 'large';
  isDark: boolean;
  isArabic: boolean;
  inCart: boolean;
  onClick: () => void;
  isActive?: boolean;
}

function CarouselCard({ agent, size, isDark, isArabic, inCart, onClick, isActive }: CarouselCardProps) {
  const sizeConfig = {
    tiny: {
      container: 'w-20 md:w-24',
      image: 'w-20 h-24 md:w-24 md:h-28',
      rounded: 'rounded-xl',
      opacity: 'opacity-40',
      scale: 'scale-90',
      showInfo: false,
      zIndex: 1,
    },
    medium: {
      container: 'w-28 md:w-36',
      image: 'w-28 h-36 md:w-36 md:h-44',
      rounded: 'rounded-2xl',
      opacity: 'opacity-60',
      scale: 'scale-95',
      showInfo: true,
      zIndex: 5,
    },
    large: {
      container: 'w-48 md:w-64',
      image: 'w-48 h-60 md:w-64 md:h-80',
      rounded: 'rounded-2xl',
      opacity: 'opacity-100',
      scale: 'scale-100',
      showInfo: true,
      zIndex: 10,
    },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      layout
      className={`flex flex-col items-center mx-1 md:mx-2 transition-all duration-500 ${config.container} ${config.opacity} ${
        !isActive ? 'cursor-pointer hover:opacity-80' : ''
      }`}
      style={{ zIndex: config.zIndex }}
      onClick={onClick}
      whileHover={!isActive ? { scale: 1.05 } : undefined}
    >
      <div className={`relative ${config.image} ${config.rounded} overflow-hidden ${config.scale} transition-transform duration-500`}>
        {/* Glow effect for active */}
        {isActive && (
          <div
            className="absolute -inset-2 rounded-3xl blur-xl opacity-30 -z-10"
            style={{ backgroundColor: agent.color }}
          />
        )}

        <img
          src={agentAvatars[agent.id]}
          alt={agent.name}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-t from-[#2a2458]/90 via-transparent to-transparent'
              : 'bg-gradient-to-t from-white/90 via-transparent to-transparent'
          }`}
        />

        {/* In Cart Badge */}
        {inCart && (
          <div className="absolute top-2 end-2 w-7 h-7 flex items-center justify-center rounded-full bg-teal-500 shadow-lg z-10">
            <i className="ri-check-line text-white text-sm"></i>
          </div>
        )}

        {/* Name on image for large */}
        {size === 'large' && (
          <div className="absolute bottom-3 start-3 end-3 z-10">
            <div className={`px-3 py-2 rounded-xl backdrop-blur-md ${isDark ? 'bg-black/30' : 'bg-white/60'}`}>
              <p className={`font-mono font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {agent.name}
              </p>
              <p className="font-mono text-xs" style={{ color: agent.color }}>
                {agent.role}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Name below for medium */}
      {size === 'medium' && config.showInfo && (
        <div className="mt-2 text-center">
          <p className={`font-mono text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
            {agent.name}
          </p>
          <p className="font-mono text-[10px]" style={{ color: agent.color }}>
            {agent.role}
          </p>
        </div>
      )}
    </motion.div>
  );
}
