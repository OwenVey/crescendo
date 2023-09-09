import { atomWithStorage } from 'jotai/utils';

const getUrlSearch = () => {
  return window.location.search.slice(1);
};

export function atomWithSearchParam<Value>(key: string, initialValue: Value) {
  return atomWithStorage(key, initialValue, {
    getItem(key, initialValue) {
      console.log('getItem():', key);

      const url = new URL(window.location.href);
      const valueFromParams = url.searchParams.get(key);
      return valueFromParams ? (valueFromParams as Value) : initialValue;
    },
    setItem(key, value) {
      console.log('setItem():', value);
      if (getUrlSearch()) {
        const searchParams = new URLSearchParams(getUrlSearch());
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          searchParams.set(key, value.toString());
          window.history.replaceState(null, '', `?${searchParams.toString()}`);
        }
      }
    },
    removeItem(key) {
      const searchParams = new URLSearchParams(getUrlSearch());
      searchParams.delete(key);
      window.location.search = searchParams.toString();
    },
  });
}
