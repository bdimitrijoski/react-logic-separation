export const getUserIdFromPath = (): string | undefined => {
  // extract userId from URL path if present
  // just a temporary solution for now
  return window.location.pathname.match('/users/[\\d]+') ? window.location.pathname.split('/')[2] : undefined;
}