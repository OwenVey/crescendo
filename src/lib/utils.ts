import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectToURLSearchParams(obj: Record<string, string | string[] | number>): URLSearchParams {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      (obj[key] as string[]).forEach((item) => params.append(key, item));
    } else {
      params.append(key, obj[key].toString());
    }
  }

  return params;
}

export function arrayToURLSearchParams(
  paramName: string,
  array: Array<string | number>,
  params: URLSearchParams = new URLSearchParams(),
): URLSearchParams {
  // const params = new URLSearchParams();
  array.forEach((item) => params.append(paramName, item.toString()));
  return params;
}
