import { useState, useEffect } from 'react';

export type OpenStatus = 'open' | 'closed' | 'closing-soon';

const OPEN_HOUR = 10;
const CLOSE_HOUR = 22;

export function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus>('closed');
  const [nextChange, setNextChange] = useState('');

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const sydney = new Date(
        now.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }),
      );
      const h = sydney.getHours();
      const m = sydney.getMinutes();
      const totalMins = h * 60 + m;
      const openMins = OPEN_HOUR * 60;
      const closeMins = CLOSE_HOUR * 60;

      if (totalMins >= openMins && totalMins < closeMins - 30) {
        setStatus('open');
        const minsLeft = closeMins - totalMins;
        const hrs = Math.floor(minsLeft / 60);
        const mins = minsLeft % 60;
        setNextChange(hrs > 0 ? `Closes in ${hrs}h ${mins}m` : `Closes in ${mins}m`);
      } else if (totalMins >= closeMins - 30 && totalMins < closeMins) {
        setStatus('closing-soon');
        setNextChange('Closing soon');
      } else {
        setStatus('closed');
        const minsUntilOpen =
          totalMins < openMins
            ? openMins - totalMins
            : 24 * 60 - totalMins + openMins;
        const hrs = Math.floor(minsUntilOpen / 60);
        const mins = minsUntilOpen % 60;
        setNextChange(
          hrs > 0 ? `Opens in ${hrs}h ${mins}m` : `Opens in ${mins}m`,
        );
      }
    };

    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return { status, nextChange };
}
