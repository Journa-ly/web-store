import { serverClient } from 'clients/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { H } from '@highlight-run/next/server';

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
    throw new Error('test');

    // Call the Django API with the session cookie
    await serverClient.post(
      `/designs/designs/${designId}/share/`,
      {},
      {
        headers: {
          Cookie: `sessionid=${sessionId}; csrftoken=${csrfToken}`,
          'X-CSRFToken': csrfToken
        }
      }
    );
  } catch (error) {
    console.error('Error sharing design:', error);
    if (error instanceof Error) {
      H.consumeError(error);
    }
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
