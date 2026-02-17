export function buildRedirectUrl(
  path: string,
  toast?: { type: 'success' | 'error'; message: string }
): string {
  if (!toast) return path;
  const params = new URLSearchParams({
    toast: toast.type,
    toastMessage: toast.message,
  });
  return `${path}?${params.toString()}`;
}
