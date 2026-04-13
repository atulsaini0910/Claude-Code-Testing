import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CATERING_PACKAGES } from '@/data/cateringPackages';
import toast from 'react-hot-toast';
import type { CateringInquiryData } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().regex(/^(\+61|0)[4-9]\d{8}$/, 'Valid Australian mobile required'),
  email: z.string().email('Valid email required'),
  eventType: z.string().min(1, 'Please select event type'),
  eventDate: z.string().min(1, 'Event date required'),
  guestCount: z.coerce.number().min(20, 'Minimum 20 guests').max(500, 'Maximum 500 guests'),
  packageId: z.string().min(1, 'Please select a package'),
  message: z.string().min(20, 'Please provide more details (min 20 chars)').max(1000),
});

const EVENT_TYPES = ['Birthday Party', 'Wedding', 'Corporate Event', 'Cultural Festival', 'Anniversary', 'Other'];

interface CateringInquiryFormProps {
  defaultPackageId?: string;
}

export function CateringInquiryForm({ defaultPackageId = '' }: CateringInquiryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CateringInquiryData>({
    resolver: zodResolver(schema),
    defaultValues: { packageId: defaultPackageId, guestCount: 50 },
  });

  const onSubmit = (_data: CateringInquiryData) => {
    // TODO: BACKEND_ENDPOINT — wire to catering inquiry API
    toast.success("Catering inquiry sent! We'll get back to you within 24 hours.", { duration: 5000 });
    reset();
  };

  const inputCls = 'w-full bg-white/5 border border-white/10 focus:border-saffron-500/60 rounded-xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors';
  const labelCls = 'block text-xs text-cream/60 mb-1.5 font-medium';
  const errorCls = 'text-red-400 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input {...register('name')} type="text" placeholder="Your name" className={inputCls} />
          {errors.name && <p className={errorCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Mobile *</label>
          <input {...register('phone')} type="tel" placeholder="04XX XXX XXX" className={inputCls} />
          {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Email *</label>
        <input {...register('email')} type="email" placeholder="you@email.com" className={inputCls} />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Event Type *</label>
          <select {...register('eventType')} className={inputCls}>
            <option value="">Select type</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.eventType && <p className={errorCls}>{errors.eventType.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Event Date *</label>
          <input {...register('eventDate')} type="date" className={inputCls} />
          {errors.eventDate && <p className={errorCls}>{errors.eventDate.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Guest Count *</label>
          <input {...register('guestCount')} type="number" min={20} max={500} className={inputCls} />
          {errors.guestCount && <p className={errorCls}>{errors.guestCount.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Package *</label>
        <select {...register('packageId')} className={inputCls}>
          <option value="">Select package</option>
          {CATERING_PACKAGES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ${p.pricePerHead}/person ({p.minGuests}–{p.maxGuests} guests)
            </option>
          ))}
        </select>
        {errors.packageId && <p className={errorCls}>{errors.packageId.message}</p>}
      </div>

      <div>
        <label className={labelCls}>Tell us about your event *</label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Event venue, any special requirements, dietary needs, preferred cuisine style..."
          className={`${inputCls} resize-none`}
        />
        {errors.message && <p className={errorCls}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold py-4 rounded-full transition-colors cursor-pointer"
      >
        {isSubmitting ? 'Sending...' : 'Send Catering Inquiry'}
      </button>
    </form>
  );
}
