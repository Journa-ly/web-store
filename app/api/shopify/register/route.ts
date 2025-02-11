// pages/api/signup.ts
import { shopifyFetch } from 'lib/shopify';
import { NextApiRequest, NextApiResponse } from 'next';

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
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

  const { email, firstName, lastName, password, acceptsMarketing } = req.body;

  try {
    const data = await shopifyFetch<{
      data: {
        customerCreate: {
          customer: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
          } | null;
          customerUserErrors: Array<{ message: string; field: string[] }>;
        };
      };
    }>(CUSTOMER_CREATE_MUTATION, {
      input: {
        email,
        firstName,
        lastName,
        password,
        acceptsMarketing
      }
    });

    const { customerCreate } = data.data;
    if (customerCreate?.customerUserErrors?.length) {
      return res.status(400).json({
        errors: customerCreate.customerUserErrors
      });
    }

    return res.status(200).json({ customer: customerCreate.customer });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
