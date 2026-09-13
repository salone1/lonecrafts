export const checkAuth = (request: Request): boolean => {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  // In production, you'd validate the JWT token here
  // For now, just check it exists
  return !!authHeader.slice(7);
};
