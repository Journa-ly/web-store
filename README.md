# Next.js Commerce

A high-performance, server-rendered Next.js App Router ecommerce application.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## Integrations

Integrations enable upgraded or additional functionality for Next.js Commerce

- [Orama](https://github.com/oramasearch/nextjs-commerce) ([Demo](https://vercel-commerce.oramasearch.com/))

  - Upgrades search to include typeahead with dynamic re-rendering, vector-based similarity search, and JS-based configuration.
  - Search runs entirely in the browser for smaller catalogs or on a CDN for larger.

- [React Bricks](https://github.com/ReactBricks/nextjs-commerce-rb) ([Demo](https://nextjs-commerce.reactbricks.com/))
  - Edit pages, product details, and footer content visually using [React Bricks](https://www.reactbricks.com) visual headless CMS.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Shopify store.

```bash
npm install
npm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Vercel, Next.js Commerce, and Shopify Integration Guide

You can use this comprehensive [integration guide](https://vercel.com/docs/integrations/ecommerce/shopify) with step-by-step instructions on how to configure Shopify as a headless CMS using Next.js Commerce as your headless Shopify storefront on Vercel.

## Cloudflare Turnstile Integration

The application uses Cloudflare Turnstile for protection against bots on authentication forms. Follow these steps to set it up:

### 1. Create a Cloudflare Turnstile Site

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and sign in
2. Navigate to **Security** > **Turnstile**
3. Click **Add Site**
4. Configure your site with the following settings:
   - **Name**: Your site name
   - **Domains**: Add your domain(s) where the widget will be used
   - **Widget Mode**: Select "Invisible" for a non-intrusive experience or "Managed" for a visible challenge
   - **Type**: "Non-Interactive" is recommended for most use cases

### 2. Get Your Turnstile Keys

After creating your site, you'll receive:

- **Site Key**: Used in the frontend to render the widget
- **Secret Key**: Used in the backend to verify the token

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_site_key_here
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_secret_key_here
```

### 4. Backend Integration

Make sure your backend API is configured to validate the Turnstile token with Cloudflare's API. The token is sent with login and registration requests as `cfTurnstileResponse`.

Example validation in Django:

```python
import requests

def validate_turnstile(token, remote_ip):
    data = {
        'secret': os.environ.get('CLOUDFLARE_TURNSTILE_SECRET_KEY'),
        'response': token,
        'remoteip': remote_ip
    }

    response = requests.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        data=data
    )

    result = response.json()
    return result.get('success', False)
```

The authentication forms in the application now include Turnstile protection and will automatically send the token with login and registration requests.
