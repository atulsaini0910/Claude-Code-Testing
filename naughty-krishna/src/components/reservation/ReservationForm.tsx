import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { ReservationFormData } from '@/types';

const today = new Date().toISOString().split('T')[0];

const TIME_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30',
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(\+61|0)[4-9]\d{8}$/, 'Enter a valid Australian mobile'),
  email: z.string().email('Enter a valid email'),
  date: z.string().min(1, 'Please select a date').refine(
    (d) => d >= today,
    'Date must be today or in the future',
  ),
  time: z.string().min(1, 'Please select a time'),
  partySize: z.coerce.number().min(1).max(20),
  specialRequests: z.string().max(500).optional(),
});

export function ReservationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(schema),
    defaultValues: { partySize: 2 },
  });

  const onSubmit = (_data: ReservationFormData) => {
    // TODO: BACKEND_ENDPOINT — wire to reservation API
    toast.success("Reservation request sent! We'll confirm within 1 hour.", {
      duration: 5000,
    });
    reset();
  };

  const inputCls =
    'w-full bg-white/5 border border-white/10 focus:border-saffron-500/60 rounded-xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors';
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
          <label className={labelCls}>Mobile Number *</label>
          <input {...register('phone')} type="tel" placeholder="04XX XXX XXX" className={inputCls} />
          {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Email Address *</label>
        <input {...register('email')} type="email" placeholder="you@email.com" className={inputCls} />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Date *</label>
          <input {...register('date')} type="date" min={today} className={inputCls} />
          {errors.date && <p className={errorCls}>{errors.date.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Time *</label>
          <select {...register('time')} className={inputCls}>
            <option value="">Select time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.time && <p className={errorCls}>{errors.time.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Party Size *</label>
          <select {...register('partySize')} className={inputCls}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
          {errors.partySize && <p className={errorCls}>{errors.partySize.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Special Requests (optional)</label>
        <textarea
          {...register('specialRequests')}
          rows={3}
          placeholder="Dietary requirements, accessibility needs, special occasions..."
          className={`${inputCls} resize-none`}
        />
        {errors.specialRequests && <p className={errorCls}>{errors.specialRequests.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-crimson-800 hover:bg-crimson-700 disabled:opacity-60 text-white font-semibold py-4 rounded-full transition-colors cursor-pointer text-base"
      >
        {isSubmitting ? 'Sending Request...' : 'Request Reservation'}
      </button>
      <p className="text-center text-cream/40 text-xs">
        Reservations are subject to availability. We'll confirm via phone or email.
      </p>
    </form>
  );
}
