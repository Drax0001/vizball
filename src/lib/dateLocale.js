import { fr, enUS } from 'date-fns/locale';

export function getDateLocale(lang) {
  return lang === 'en' ? enUS : fr;
}
