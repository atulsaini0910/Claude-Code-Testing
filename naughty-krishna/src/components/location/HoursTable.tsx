import { RESTAURANT } from '@/lib/constants';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function HoursTable() {
  const todayIndex = new Date().getDay();
  // getDay(): 0=Sun, 1=Mon ... 6=Sat. Remap to our array (Mon=0, Sun=6)
  const todayDayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  return (
    <table className="w-full text-sm">
      <tbody>
        {DAYS.map((day, i) => (
          <tr
            key={day}
            className={`border-b border-white/5 last:border-0 ${
              i === todayDayIndex ? 'text-saffron-400' : 'text-cream/60'
            }`}
          >
            <td className="py-2 font-medium">
              {day}
              {i === todayDayIndex && (
                <span className="ml-2 text-xs bg-saffron-500/20 text-saffron-400 px-1.5 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </td>
            <td className="py-2 text-right">{RESTAURANT.hours.display}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
