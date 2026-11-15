import React from 'react';
import { AppState, ApprovalRequest, Language, UserRole } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, XCircle, Plus, ShieldCheck } from 'lucide-react';

interface OkKroViewProps {
  t: Translations;
  lang?: Language;
  role?: UserRole;
  appData: AppState;
  handleApproval: (id: number, status: 'approved' | 'rejected') => void;
  onAddRequest: (req: Omit<ApprovalRequest, 'id' | 'status' | 'date'>) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  theme: 'dark' | 'light';
}

export const OkKroView: React.FC<OkKroViewProps> = ({
  t,
  lang = 'ur',
  role = 'parent',
  appData,
  handleApproval,
  onAddRequest,
  onNotify,
}) => {
  const isParentOrAdmin = role === 'parent' || role === 'admin';
  const defaultKid = role === 'teen' ? 'Fatima' : 'Ahmed';

  const [filter, setFilter] = React.useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [stampedId, setStampedId] = React.useState<number | null>(null);

  const [newTitle, setNewTitle] = React.useState('');
  const [newAmount, setNewAmount] = React.useState('');
  const [newKid, setNewKid] = React.useState(defaultKid);
  const [newType, setNewType] = React.useState<'saving' | 'course_purchase' | 'purchase' | 'charity' | 'gadget'>('purchase');
  const [newNotes, setNewNotes] = React.useState('');

  React.useEffect(() => {
    setNewKid(role === 'teen' ? 'Fatima' : 'Ahmed');
  }, [role]);

  // Strict data isolation: Kid only sees Ahmed's requests, Teen only sees Fatima's requests
  const roleScopedApprovals = appData.approvals.filter((item) => {
    if (role === 'kid') return item.kid.toLowerCase().includes('ahmed');
    if (role === 'teen') return item.kid.toLowerCase().includes('fatima');
    return true;
  });

  const filteredApprovals = roleScopedApprovals.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const totalPendingAmount = roleScopedApprovals
    .filter((a) => a.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalApprovedAmount = roleScopedApprovals
    .filter((a) => a.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const maxLimit =
    role === 'kid'
      ? appData.kidSpendingLimit
      : role === 'teen'
      ? appData.teenSpendingLimit
      : undefined;

  const onApproveClick = (id: number) => {
    if (!isParentOrAdmin) return;
    setStampedId(id);
    playSound('coin');
    try {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
    } catch {}

    setTimeout(() => {
      handleApproval(id, 'approved');
      setStampedId(null);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;

    const amt = Math.abs(Number(newAmount));
    if (maxLimit && amt > maxLimit) {
      playSound('alert');
      onNotify?.(
        lang === 'en'
          ? `Amount exceeds your seat limit of Rs ${maxLimit.toLocaleString()}.`
          : `رقم آپ کی مقررہ حد Rs ${maxLimit.toLocaleString()} سے زیادہ ہے۔`,
        'error'
      );
      return;
    }

    onAddRequest({
      kid: role === 'kid' ? 'Ahmed' : role === 'teen' ? 'Fatima' : newKid,
      amount: amt,
      type: newType,
      title: newTitle.trim(),
      category: newType,
      notes: newNotes.trim(),
    });

    playSound('success');
    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.navOkKro}
          </h2>
          <p className="text-xs sm:text-sm mt-1 max-w-xl text-slate-600 dark:text-slate-300">
            {isParentOrAdmin
              ? lang === 'ps'
                ? 'د ماشومانو د ټولو مالي غوښتنو څارنه وکړئ او په یوه کلیک شرعي تائید ورکړئ.'
                : lang === 'en'
                ? 'Review children spending requests and grant 1-click Sharia parental approvals.'
                : 'بچوں کے تمام مالیاتی مطالبات کا جائزہ لیں اور ایک کلک پر شرعی منظوری (اوکے کرو) دیں۔'
              : lang === 'en'
              ? 'Submit spending or savings requests to your parents and track approval status.'
              : 'اپنے والدین کو خریداری یا بچت کی درخواست بھیجیں اور منظوری کی صورتحال دیکھیں۔'}
          </p>
        </div>

        <button
          onClick={() => {
            playSound('click');
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newRequest}</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-1">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">{t.pending}</div>
          <div className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {roleScopedApprovals.filter((a) => a.status === 'pending').length}{' '}
            <span className="text-sm font-sans font-normal text-slate-500 dark:text-slate-400">
              {lang === 'ps' ? 'غوښتنې' : lang === 'en' ? 'Requests' : 'مطالبات'}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            Rs {totalPendingAmount.toLocaleString()} {t.pkr}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-1">
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t.approved}</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            Rs {totalApprovedAmount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.halalCertified}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-1">
          <div className="text-xs font-semibold text-[#0E7490] dark:text-[#22D3EE] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{isParentOrAdmin ? 'Sharia Governance' : 'Seat Limit'}</span>
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {maxLimit ? `Rs ${maxLimit.toLocaleString()}` : 'A+ Grade'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isParentOrAdmin
              ? lang === 'en' ? 'Parental Digital Seal' : 'والدین کی ڈیجیٹل مہر'
              : lang === 'en' ? 'Per-request ceiling' : 'فی درخواست مقررہ حد'}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#232852] pb-3 overflow-x-auto">
        {[
          { id: 'all', label: lang === 'en' ? 'All' : 'تمام (All)' },
          {
            id: 'pending',
            label: t.pending,
            badge: roleScopedApprovals.filter((a) => a.status === 'pending').length,
          },
          { id: 'approved', label: t.approved },
          { id: 'rejected', label: t.rejected },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              setFilter(tab.id as any);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              filter === tab.id
                ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                : 'bg-slate-100 dark:bg-[#10132C] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#232852] hover:bg-slate-200 dark:hover:bg-[#161B3B]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono tabular-nums leading-none">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filteredApprovals.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#10132C] border border-dashed border-slate-300 dark:border-[#232852] space-y-1.5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.noPendingText}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.allDoneText}</p>
          </div>
        ) : (
          filteredApprovals.map((req) => (
            <div
              key={req.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
            >
              {/* Approval Stamp Overlay */}
              {stampedId === req.id && (
                <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
                  <div className="animate-stamp border-2 border-emerald-400 rounded-xl px-5 py-3 text-emerald-300 font-serif font-bold text-xl uppercase tracking-wider bg-[#07091B]">
                    ✓ APPROVED · اوکے کرو
                  </div>
                </div>
              )}

              <div className="space-y-1.5 flex-grow">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-[#B45309] dark:text-[#FBBF24]">
                    {req.kid}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{req.type}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">{req.date}</span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {req.title}
                </h4>

                {req.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] px-3 py-2 rounded-xl max-w-xl">
                    {req.notes}
                  </p>
                )}

                <div className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums pt-1">
                  Rs {req.amount.toLocaleString()}{' '}
                  <span className="text-xs font-sans font-normal text-slate-500 dark:text-slate-400">
                    {t.pkr}
                  </span>
                </div>
              </div>

              {/* Action Buttons (Strict Parent/Admin Gate) */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
                {req.status === 'pending' && isParentOrAdmin ? (
                  <>
                    <button
                      onClick={() => onApproveClick(req.id)}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.approveBtn}</span>
                    </button>
                    <button
                      onClick={() => {
                        playSound('click');
                        handleApproval(req.id, 'rejected');
                      }}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t.rejectBtn}</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                      req.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {req.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                    {req.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                    <span>
                      {req.status === 'approved'
                        ? t.approved
                        : req.status === 'rejected'
                        ? t.rejected
                        : t.pending}
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#07091B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-[3px] w-full nibras-accent-bar" />
            <div className="p-6 sm:p-7 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                  {t.newRequest}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isParentOrAdmin && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'en' ? 'Child' : 'نام'}
                    </label>
                    <select
                      value={newKid}
                      onChange={(e) => setNewKid(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-[#FBBF24]"
                    >
                      <option value="Ahmed">{t.roleKid}</option>
                      <option value="Fatima">{t.roleTeen}</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'en' ? 'Request Title' : 'عنوان'}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. Islamic Story Book, School Project' : 'مثال: اسلامی کتب، تعلیمی پراجیکٹ، بچت کا ہدف'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-[#FBBF24]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'en' ? 'Amount (PKR)' : 'رقم (PKR)'}
                    </label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="1500"
                      min="50"
                      max={maxLimit}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-sm outline-none focus:border-[#FBBF24]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'en' ? 'Category' : 'قسم'}
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-[#FBBF24]"
                    >
                      <option value="purchase">{lang === 'en' ? 'Books & Supplies' : 'ضروری کتب و سامان'}</option>
                      <option value="saving">{lang === 'en' ? 'Savings Goal' : 'بچت کا ہدف'}</option>
                      <option value="course_purchase">{lang === 'en' ? 'Academy Course' : 'اکیڈمی کورس'}</option>
                      <option value="charity">{lang === 'en' ? 'Sadaqah & Charity' : 'صدقہ و خیرات'}</option>
                      <option value="gadget">{lang === 'en' ? 'Study Tools' : 'تعلیمی آلات'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'en' ? 'Reason / Note' : 'وضاحتی نوٹ'}
                  </label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    rows={2}
                    placeholder={lang === 'en' ? 'Why is this needed...' : 'یہ رقم کس فائدے کے لیے درکار ہے...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-[#FBBF24]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs cursor-pointer"
                  >
                    {t.submitRequest}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    {t.close}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
