import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import type { CheckoutFormData } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^(\+61|0)[4-9]\d{8}$/, 'Enter a valid Australian mobile number'),
  email: z.string().email('Enter a valid email address'),
  deliveryAddress: z
    .string()
    .min(10, 'Please enter your full delivery address'),
  notes: z.string().optional(),
  paymentMethod: z.union([z.literal('card'), z.literal('cash')]),
});

interface CheckoutFormProps {
  onClose: () => void;
}

export function CheckoutForm({ onClose }: CheckoutFormProps) {
  const { clearCart, closeCart } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'card' },
  });

  const onSubmit = (_data: CheckoutFormData) => {
    // TODO: BACKEND_ENDPOINT — wire to real ordering API
    const orderNum = Math.floor(Math.random() * 9000) + 1000;
    toast.success(`Order #${orderNum} placed! We'll confirm shortly.`, {
      duration: 5000,
    });
    setTimeout(() => {
      clearCart();
      closeCart();
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-cream font-bold text-base">Delivery Details</h3>
        <button
          onClick={onClose}
          className="text-cream/40 hover:text-cream transition-colors cursor-pointer"
          aria-label="Back to cart"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {[
          { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'Your name' },
          { name: 'phone' as const, label: 'Mobile Number', type: 'tel', placeholder: '04XX XXX XXX' },
          { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@email.com' },
          { name: 'deliveryAddress' as const, label: 'Delivery Address', type: 'text', placeholder: '123 Main St, Suburb NSW 2XXX' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-xs text-cream/60 mb-1.5 font-medium">
              {field.label}
            </label>
            <input
              {...register(field.name)}
              type={field.type}
              placeholder={field.placeholder}
              className="w-full bg-white/5 border border-white/10 focus:border-saffron-500/60 rounded-xl px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors"
            />
            {errors[field.name] && (
              <p className="text-red-400 text-xs mt-1">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-xs text-cream/60 mb-1.5 font-medium">
            Order Notes (optional)
          </label>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Allergies, special requests..."
            className="w-full bg-white/5 border border-white/10 focus:border-saffron-500/60 rounded-xl px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-cream/60 mb-2 font-medium">
            Payment Method
          </label>
          <div className="flex gap-2">
            {(['card', 'cash'] as const).map((method) => (
              <label
                key={method}
                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 cursor-pointer has-[:checked]:border-saffron-500 has-[:checked]:bg-saffron-500/10 transition-all text-sm text-cream/60 has-[:checked]:text-cream"
              >
                <input
                  {...register('paymentMethod')}
                  type="radio"
                  value={method}
                  className="sr-only"
                />
                {method === 'card' ? '💳 Card' : '💵 Cash'}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full transition-colors cursor-pointer"
        >
          {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </form>
    </div>
  );
}
