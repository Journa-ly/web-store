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

  // Redirect back to the original page without the share parameters
  const redirectUrl = new URL(returnUrl, request.url);
  redirectUrl.searchParams.set('selected', designId);

  // Preserve any existing query parameters from the return URL
  const returnUrlObj = new URL(returnUrl, request.url);
  returnUrlObj.searchParams.forEach((value, key) => {
    if (key !== 'selected') {
      redirectUrl.searchParams.set(key, value);
    }
  });

  return redirect(redirectUrl.toString());
}
