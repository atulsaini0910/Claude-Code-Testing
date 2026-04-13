import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { ContactFormData } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(1000),
});

const SUBJECTS = ['General Enquiry', 'Reservation', 'Catering', 'Feedback', 'Media', 'Other'];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(schema) });

  const onSubmit = (_data: ContactFormData) => {
    // TODO: BACKEND_ENDPOINT — wire to contact API or EmailJS
    toast.success("Message sent! We'll respond within 24 hours.", { duration: 5000 });
    reset();
  };

  const inputCls = 'w-full bg-white/5 border border-white/10 focus:border-saffron-500/60 rounded-xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors';
  const labelCls = 'block text-xs text-cream/60 mb-1.5 font-medium';
  const errorCls = 'text-red-400 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Your Name *</label>
          <input {...register('name')} type="text" placeholder="Full name" className={inputCls} />
          {errors.name && <p className={errorCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input {...register('email')} type="email" placeholder="you@email.com" className={inputCls} />
          {errors.email && <p className={errorCls}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Phone (optional)</label>
          <input {...register('phone')} type="tel" placeholder="04XX XXX XXX" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Subject *</label>
          <select {...register('subject')} className={inputCls}>
            <option value="">Select subject</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject && <p className={errorCls}>{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Message *</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="How can we help you?"
          className={`${inputCls} resize-none`}
        />
        {errors.message && <p className={errorCls}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold py-4 rounded-full transition-colors cursor-pointer"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
