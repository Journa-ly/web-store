import { serverClient } from 'clients/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const designId = searchParams.get('design');
  const returnUrl = searchParams.get('return') || '/';

  if (!designId) {
    return redirect(returnUrl);
  }

  try {
    // Get all cookies from the request
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionid')?.value;
    const csrfToken = cookieStore.get('csrftoken')?.value;

    if (!sessionId || !csrfToken) {
      console.error('Missing session or CSRF token');
      throw new Error('Authentication cookies not found');
    }

    // Call the Django API with the session cookie
    const response = await serverClient.post(
      `/designs/designs/${designId}/share/`,
      {},
      {
        headers: {
          Cookie: `sessionid=${sessionId}; csrftoken=${csrfToken}`,
          'X-CSRFToken': csrfToken
        }
      }
    );

    Sentry.captureEvent({
      message: 'Design shared',
      extra: {
        design_id: designId,
        return_url: returnUrl,
        session_id: sessionId,
        csrf_token: csrfToken,
        server_response: response.data
      }
    });
  } catch (error) {
    console.error('Error sharing design:', error);
    Sentry.captureException(error, {

    });
  }

  // Get the current request's origin to use as base URL
  const requestOrigin = request.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${requestOrigin}`;

  // Ensure returnUrl starts with a slash
  const normalizedReturnUrl = returnUrl.startsWith('/') ? returnUrl : `/${returnUrl}`;

  // Create the full URL with the current origin
  const redirectUrl = new URL(normalizedReturnUrl, baseUrl);

  // Add the selected design parameter
  redirectUrl.searchParams.set('selected', designId);

  // Preserve any existing query parameters from the return URL
  const returnUrlObj = new URL(normalizedReturnUrl, baseUrl);
  returnUrlObj.searchParams.forEach((value, key) => {
    if (key !== 'selected') {
      redirectUrl.searchParams.set(key, value);
    }
  });

  return redirect(redirectUrl.toString());
}
