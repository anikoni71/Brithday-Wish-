import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { Sparkles, Copy, Check, Send, User, Briefcase, RefreshCw, X, MessageSquare } from 'lucide-react';

interface WishGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  initialMember?: TeamMember | null;
  onSendWhatsApp: (member: TeamMember, messageOverride: string) => Promise<void>;
  onApplyWishToMember?: (memberId: string, newWish: string) => void;
}

export const WishGeneratorModal: React.FC<WishGeneratorModalProps> = ({
  isOpen,
  onClose,
  teamMembers,
  initialMember,
  onSendWhatsApp,
  onApplyWishToMember,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [tone, setTone] = useState<string>('Warm Team Leader');
  const [generatedWish, setGeneratedWish] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    if (initialMember) {
      setSelectedMemberId(initialMember.id || initialMember.sl);
      setName(initialMember.name);
      setDesignation(initialMember.designation);
      setGeneratedWish(initialMember.wishingMessage || '');
    } else if (teamMembers.length > 0 && !selectedMemberId) {
      const first = teamMembers[0];
      setSelectedMemberId(first.id || first.sl);
      setName(first.name);
      setDesignation(first.designation);
      setGeneratedWish(first.wishingMessage || '');
    }
  }, [initialMember, teamMembers]);

  if (!isOpen) return null;

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedMemberId(val);
    if (val === 'custom') {
      setName('');
      setDesignation('');
      setGeneratedWish('');
    } else {
      const found = teamMembers.find(m => (m.id || m.sl) === val || m.name === val);
      if (found) {
        setName(found.name);
        setDesignation(found.designation);
        setGeneratedWish(found.wishingMessage || `Happy Birthday, ${found.name}! Wishing you a great day from the IE Central Team. 🎉`);
      }
    }
  };

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), designation: designation.trim(), tone }),
      });
      const data = await res.json();
      if (data.wish) {
        setGeneratedWish(data.wish);
      }
    } catch (err) {
      console.error('Error generating wish:', err);
      setGeneratedWish(`Happy Birthday, ${name}! Wishing you a great day from the IE Central Team. 🎉`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedWish) return;
    navigator.clipboard.writeText(generatedWish);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendNow = async () => {
    if (!generatedWish || !name) return;
    const targetMember = teamMembers.find(m => (m.id || m.sl) === selectedMemberId || m.name === name) || {
      sl: '0',
      id: '',
      name,
      designation,
      birthday: '',
      mobile: '',
      email: '',
      whatsapp: '',
      wishingMessage: generatedWish,
      isBirthdayToday: false,
    };

    setIsSending(true);
    try {
      await onSendWhatsApp(targetMember, generatedWish);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveToSheetPreview = () => {
    if (onApplyWishToMember && selectedMemberId && generatedWish) {
      onApplyWishToMember(selectedMemberId, generatedWish);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/50 flex items-center justify-center border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Team Leader Wish Generator</h2>
              <p className="text-xs text-emerald-100">
                Concise, warm, 1-2 sentence birthday messages for IE Central Team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-emerald-100 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Colleague Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Colleague from Central IE List:
            </label>
            <select
              value={selectedMemberId}
              onChange={handleMemberSelect}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-hidden font-medium text-slate-800"
            >
              {teamMembers.map(m => (
                <option key={m.id || m.sl || m.name} value={m.id || m.sl || m.name}>
                  {m.name} ({m.designation || 'Team Member'}) {m.isBirthdayToday ? '🎂 Today!' : ''}
                </option>
              ))}
              <option value="custom">+ Enter Custom Name & Designation</option>
            </select>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Name (Column D):
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Dipankar Barua"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Designation (Column E):
              </label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                placeholder="e.g. Executive"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Wishing Tone:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Warm Team Leader', value: 'Warm Team Leader' },
                { label: 'Cheerful & Upbeat', value: 'Cheerful & Enthusiastic' },
                { label: 'Inspiring Executive', value: 'Inspiring & Executive' }
              ].map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-center transition cursor-pointer ${
                    tone === t.value
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !name.trim()}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Drafting Warm Wish...' : 'Generate Team Leader Birthday Wish'}
          </button>

          {/* Result Output */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Generated Wish (Column K Format):
              </label>
              {generatedWish && (
                <button
                  onClick={handleCopy}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {isCopied ? 'Copied!' : 'Copy Text'}
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={generatedWish}
              onChange={e => setGeneratedWish(e.target.value)}
              className="w-full p-3 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden leading-relaxed"
              placeholder="Your generated 1-2 sentence birthday wish will appear here..."
            />

            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
              Ends with exact required phrase: <span className="font-semibold text-slate-700">"Wishing you a great day from the IE Central Team!"</span>
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleSaveToSheetPreview}
            disabled={!generatedWish}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-white px-3 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            Apply to Local Column K
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleSendNow}
              disabled={isSending || !generatedWish}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Sending...' : 'Send WhatsApp Wish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
