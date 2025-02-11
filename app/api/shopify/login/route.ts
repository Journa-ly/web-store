// pages/api/login.ts
import { shopifyFetch } from 'lib/shopify';
import { NextApiRequest, NextApiResponse } from 'next';

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const data = await shopifyFetch<{
      data: {
        customerAccessTokenCreate: {
          customerAccessToken: {
            accessToken: string;
            expiresAt: string;
          } | null;
          customerUserErrors: Array<{ message: string; field: string[] }>;
        };
      };
    }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
      input: { email, password }
    });

    const { customerAccessTokenCreate } = data.data;
    if (customerAccessTokenCreate?.customerUserErrors?.length) {
      return res.status(400).json({
        errors: customerAccessTokenCreate.customerUserErrors
      });
    }

    const { accessToken, expiresAt } = customerAccessTokenCreate.customerAccessToken!;

    // Option 1: Return the token directly
    // Option 2: Set a secure HTTP-only cookie
    // For simplicity, we'll just return the token in JSON
    return res.status(200).json({ accessToken, expiresAt });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
