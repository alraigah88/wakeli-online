import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../page';
import { useTranslation } from 'react-i18next';
import type { Agent } from '../page';

interface CreateAgentModalProps {
  onClose: () => void;
  onAgentCreated: (agent: any) => void;
  editingAgent?: Agent | null;
}

type Gender = 'male' | 'female' | 'unspecified';

export default function CreateAgentModal({ onClose, onAgentCreated, editingAgent }: CreateAgentModalProps) {
  const { isDark } = useTheme();
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const isEditing = !!editingAgent;

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [role, setRole] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // جمع جميع المهام من كل الوكلاء
  const agentKeys = ['reem', 'ahmed', 'sara', 'khalid', 'nora', 'omar'];
  const allTasks: string[] = [];
  agentKeys.forEach(key => {
    const tasks = t(`agentsList.${key}.tasks`, { returnObjects: true }) as string[];
    if (Array.isArray(tasks)) {
      tasks.forEach(task => {
        if (!allTasks.includes(task)) {
          allTasks.push(task);
        }
      });
    }
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editingAgent) {
      setName(editingAgent.name || '');
      setGender(editingAgent.gender === 'female' ? 'female' : editingAgent.gender === 'male' ? 'male' : 'unspecified');
      setImagePreview(editingAgent.avatar || null);
      // Parse system field to extract role, specialization, roleDescription
      const systemParts = (editingAgent.system || '').split('. ').filter(Boolean);
      setRole(systemParts[0]?.replace(/\.$/, '') || editingAgent.role || '');
      setSpecialization(systemParts[1]?.replace(/\.$/, '') || '');
      setRoleDescription(systemParts[2]?.replace(/\.$/, '') || editingAgent.role || '');
    }
  }, [editingAgent]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTask = (task: string) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const calculateTotal = () => {
    return selectedTasks.length * 99;
  };

  const canSubmit = () => {
    return name.trim().length > 0 && gender !== null && role.trim().length > 0 && roleDescription.trim().length > 0 && selectedTasks.length > 0;
  };

  const handleConfirm = () => {
    const newAgent = {
      id: isEditing ? editingAgent!.id : `custom-${Date.now()}`,
      name,
      role: roleDescription,
      emoji: gender === 'male' ? '\uD83D\uDC68\u200D\uD83D\uDCBC' : gender === 'female' ? '\uD83D\uDC69\u200D\uD83D\uDCBC' : '\uD83E\uDDD1\u200D\uD83D\uDCBC',
      color: gender === 'male' ? '#2dd4bf' : gender === 'female' ? '#a78bfa' : '#94a3b8',
      bg: gender === 'male'
        ? 'linear-gradient(135deg, #2dd4bf22, #5eead411)'
        : gender === 'female'
        ? 'linear-gradient(135deg, #a78bfa22, #c4b5fd11)'
        : 'linear-gradient(135deg, #94a3b822, #cbd5e111)',
      system: `${role}. ${specialization}. ${roleDescription}.`,
      gender: gender === 'unspecified' ? 'male' as const : gender as 'male' | 'female',
      avatar: imagePreview || undefined,
      isCustom: true,
      tasks: selectedTasks,
      price: calculateTotal(),
    };

    setShowSuccess(true);
    setTimeout(() => {
      onAgentCreated(newAgent);
      onClose();
    }, 2200);
  };

  const inputClass = `w-full px-4 py-3 rounded-lg font-mono text-sm outline-none border transition-colors duration-500 ${
    isDark
      ? 'bg-[#3a3568]/50 border-[#5a5490]/40 text-white/90 placeholder-white/25 focus:border-[#7a74b0]'
      : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-300'
  }`;

  const labelClass = `font-mono text-xs mb-1.5 block transition-colors duration-500 ${
    isDark ? 'text-white/50' : 'text-gray-500'
  }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border transition-colors duration-500 ${
          isDark ? 'bg-[#3a3568] border-[#5a5490]/50' : 'bg-white border-gray-200'
        }`}
      >
        {showSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-6xl mb-6"
            >
              {isEditing ? '✅' : '✨'}
            </motion.div>
            <h3 className={`font-mono font-bold text-2xl mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {isEditing
                ? (isArabic ? 'تم التعديل بنجاح!' : 'Updated Successfully!')
                : (isArabic ? 'مبروك!' : 'Congratulations!')}
            </h3>
            <p className={`font-mono text-sm max-w-md ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {isEditing
                ? (isArabic ? 'تم تحديث بيانات الوكيل بنجاح 🎉' : 'Agent data has been updated successfully 🎉')
                : (isArabic ? 'أصبح لديك الآن وكيل مخصص في خدمتك لأي مهمة تحتاجها 🎉' : 'You now have a custom agent at your service for any task you need 🎉')}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between ${
              isDark ? 'border-[#5a5490]/30 bg-[#484270]/40' : 'border-gray-200 bg-gray-50/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  isDark ? 'bg-[#484270]' : 'bg-violet-100'
                }`}>
                  {isEditing ? '✏️' : '✨'}
                </div>
                <h3 className={`font-mono font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {isEditing
                    ? (isArabic ? 'تعديل الوكيل' : 'Edit Agent')
                    : (isArabic ? 'إنشاء وكيل مخصص' : 'Create Custom Agent')}
                </h3>
              </div>
              <button
                onClick={onClose}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#484270] text-white/50 hover:text-white hover:bg-[#5a5490]'
                    : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Form Content */}
            <div className={`p-5 space-y-4 max-h-[70vh] overflow-y-auto ${isDark ? '' : ''}`}>
              {/* Image Upload */}
              <div className="flex justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                    imagePreview
                      ? 'border-transparent'
                      : isDark
                      ? 'border-[#5a5490]/60 bg-[#484270]/50 hover:border-[#7a74b0] text-white/40'
                      : 'border-gray-300 bg-gray-50 hover:border-violet-400 text-gray-400'
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <i className="ri-camera-line text-white text-xl"></i>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <i className="ri-camera-line text-2xl"></i>
                      <span className="font-mono text-[9px]">{isArabic ? 'صورة' : 'Photo'}</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Name */}
              <div>
                <label className={labelClass}>
                  {isArabic ? 'اسم الوكيل *' : 'Agent Name *'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isArabic ? 'مثال: محمد، فاطمة...' : 'Example: Mohammed, Fatima...'}
                  maxLength={50}
                  className={inputClass}
                />
              </div>

              {/* Gender */}
              <div>
                <label className={labelClass}>
                  {isArabic ? 'الجنس *' : 'Gender *'}
                </label>
                <div className="flex gap-2">
                  {(['male', 'female', 'unspecified'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 px-3 py-2.5 rounded-lg font-mono text-xs transition-all cursor-pointer border flex items-center justify-center gap-2 whitespace-nowrap ${
                        gender === g
                          ? isDark
                            ? 'bg-[#5a5490]/60 border-[#7a74b0] text-white'
                            : 'bg-violet-100 border-violet-500 text-violet-800'
                          : isDark
                          ? 'bg-[#3a3568]/30 border-[#5a5490]/30 text-white/50 hover:border-[#5a5490]/60'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-violet-300'
                      }`}
                    >
                      <span className="text-base">
                        {g === 'male' ? '👨' : g === 'female' ? '👩' : '🧑'}
                      </span>
                      {g === 'male' ? (isArabic ? 'ذكر' : 'Male') : g === 'female' ? (isArabic ? 'أنثى' : 'Female') : (isArabic ? 'غير محدد' : 'Other')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className={labelClass}>
                  {isArabic ? 'الدور الأساسي *' : 'Primary Role *'}
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={isArabic ? 'مثال: متخصص تقني' : 'Example: Technical Specialist'}
                  maxLength={50}
                  className={inputClass}
                />
              </div>

              {/* Role Description */}
              <div>
                <label className={labelClass}>
                  {isArabic ? 'وصف مختصر للدور *' : 'Brief Role Description *'}
                </label>
                <input
                  type="text"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder={isArabic ? 'مثال: خبير دعم تقني' : 'Example: IT Support Expert'}
                  maxLength={50}
                  className={inputClass}
                />
              </div>

              {/* Specialization */}
              <div>
                <label className={labelClass}>
                  {isArabic ? 'التخصص التفصيلي (اختياري)' : 'Detailed Specialization (optional)'}
                </label>
                <textarea
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder={isArabic ? 'مثال: دعم تقني، حل مشاكل البرمجيات والأجهزة...' : 'Example: IT support, software and hardware troubleshooting...'}
                  rows={3}
                  maxLength={200}
                  className={`${inputClass} resize-none`}
                />
                <div className={`mt-1 font-mono text-[10px] ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
                  {specialization.length}/200
                </div>
              </div>

              {/* Tasks Selection */}
              <div>
                <label className={labelClass}>
                  {isArabic ? 'اختر المهام * (كل مهمة 99 ر.س)' : 'Select Tasks * (99 SAR each)'}
                </label>
                <div className={`rounded-lg border p-3 max-h-64 overflow-y-auto ${
                  isDark ? 'bg-[#2a2458]/40 border-[#5a5490]/30' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="space-y-2">
                    {allTasks.map((task, index) => {
                      const isSelected = selectedTasks.includes(task);
                      return (
                        <div
                          key={index}
                          onClick={() => toggleTask(task)}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? isDark
                                ? 'bg-teal-500/15 border-2 border-teal-400/40'
                                : 'bg-teal-50 border-2 border-teal-300'
                              : isDark
                              ? 'bg-[#3a3568]/40 hover:bg-[#3a3568]/60 border-2 border-transparent'
                              : 'bg-white hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all mt-0.5 ${
                              isSelected ? 'border-teal-500 bg-teal-500' : isDark ? 'border-white/25' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <i className="ri-check-line text-white text-xs"></i>}
                          </div>
                          <div className="flex-1">
                            <p className={`font-mono text-sm leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
                              {task}
                            </p>
                            <p className={`font-mono text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                              99 {isArabic ? 'ر.س' : 'SAR'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {selectedTasks.length > 0 && (
                  <div className={`mt-2 flex items-center justify-between px-3 py-2 rounded-lg ${
                    isDark ? 'bg-teal-500/10 text-teal-300' : 'bg-teal-50 text-teal-700'
                  }`}>
                    <span className="font-mono text-sm">
                      {isArabic ? `${selectedTasks.length} مهمة محددة` : `${selectedTasks.length} tasks selected`}
                    </span>
                    <span className="font-mono text-lg font-bold">
                      {calculateTotal()} {isArabic ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={`px-5 py-4 border-t flex items-center justify-between ${
              isDark ? 'border-[#5a5490]/30 bg-[#484270]/30' : 'border-gray-200 bg-white'
            }`}>
              <button
                onClick={onClose}
                className={`px-5 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
                  isDark
                    ? 'bg-[#484270]/50 text-white/60 hover:bg-[#484270]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canSubmit()}
                className={`px-6 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  !canSubmit()
                    ? isDark
                      ? 'bg-[#484270]/30 text-white/25 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${isEditing ? 'ri-save-line' : 'ri-check-line'} text-sm`}></i>
                </div>
                {isEditing
                  ? (isArabic ? 'حفظ التعديلات' : 'Save Changes')
                  : (isArabic ? 'حفظ' : 'Save')}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}