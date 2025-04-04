import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const TUTORIAL_COOKIE_NAME = 'tutorial_state';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    const tutorialCookie = req.cookies.get(TUTORIAL_COOKIE_NAME);

    // If user is authenticated, try to get their tutorial state from API
    if (token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/tutorial-state/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Return tutorial state from API
        return NextResponse.json(response.data);
      } catch (error) {
        console.error('Failed to fetch tutorial state from API:', error);
        // Fall back to cookie if API fails
      }
    }

    // Return tutorial state from cookie if available
    if (tutorialCookie) {
      try {
        const state = JSON.parse(tutorialCookie.value);
        return NextResponse.json(state);
      } catch {
        // Invalid cookie value, return empty state
        return NextResponse.json({});
      }
    }

    // No state found, return empty object
    return NextResponse.json({});
  } catch (error) {
    console.error('Error fetching tutorial state:', error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    const data = await req.json();

    // If user is authenticated, update their tutorial state in API
    if (token) {
      try {
        await axios.post(`${API_BASE_URL}/users/tutorial-state/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Failed to update tutorial state in API:', error);
        // Continue to update cookie even if API fails
      }
    }

    // Set cookie with tutorial state (expires in 30 days)
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: TUTORIAL_COOKIE_NAME,
      value: JSON.stringify(data),
      httpOnly: true,
      path: '/',
      maxAge: thirtyDaysInSeconds,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Error updating tutorial state:', error);
    return NextResponse.json({ error: 'Failed to update tutorial state' }, { status: 500 });
  }
}
