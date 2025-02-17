import { serverClient } from 'clients/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

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
    // Even if there's an error, we redirect back to avoid leaving the user stranded
  }

  // Get the current request's origin to use as base URL
  const requestOrigin = request.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${requestOrigin}`;

  // Handle absolute and relative return URLs
  const isAbsoluteUrl = returnUrl.startsWith('http://') || returnUrl.startsWith('https://');
  
  // If it's an absolute URL, use it as is, otherwise construct using the current origin
  const finalReturnUrl = isAbsoluteUrl
    ? returnUrl
    : `${baseUrl}${returnUrl.startsWith('/') ? returnUrl : `/${returnUrl}`}`;

  // Create the redirect URL
  const redirectUrl = new URL(finalReturnUrl);
  redirectUrl.searchParams.set('selected', designId);

  // Preserve existing query parameters from the return URL
  if (!isAbsoluteUrl) {
    const returnUrlObj = new URL(returnUrl, baseUrl);
    returnUrlObj.searchParams.forEach((value, key) => {
      if (key !== 'selected') {
        redirectUrl.searchParams.set(key, value);
      }
    });
  }

  return redirect(redirectUrl.toString());
}
