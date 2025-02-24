import { serverClient } from 'clients/server';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';
import { SERVER_URL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const designId = searchParams.get('design');
  const returnUrl = searchParams.get('return') || '/';
  
  // Get all cookies from the request
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid')?.value;
  const csrfToken = cookieStore.get('csrftoken')?.value;

  

  if (!designId) {
    return redirect(returnUrl);
  }

  try {
    // Make the share request - Django will create a session if one doesn't exist
    const response = await serverClient.post(
      `/designs/designs/${designId}/share/`,
      {},
      {
        headers: {
          Cookie: `sessionid=${sessionId}; csrftoken=${csrfToken}`,
          'X-CSRFToken': csrfToken,
          'Referer': SERVER_URL
        }
      }
    ).catch((error) => {
      console.error('Error sharing design:', error);
      Sentry.captureException(error, {
        extra: {
          design_id: designId,
          return_url: returnUrl,
          session_id: sessionId,
          server_response: error.response?.data
        }
      });
    });

    Sentry.captureMessage('Sharing design', {
      extra: {
        design_id: designId,
        return_url: returnUrl,
        session_id: sessionId,
        server_response: response?.data
      }
    });

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

    // Create response with redirect
    const resp = NextResponse.redirect(redirectUrl.toString());

    // Forward the session cookies from Django's response
    const setCookieHeader = response?.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        resp.headers.append('Set-Cookie', cookie);
      });
    }

    return resp;

  } catch (error) {
    console.error('Error in share route:', error);
    Sentry.captureException(error);
    return redirect(returnUrl);
  }
}
