import type { AuthOptions, DefaultSession } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { env } from '@/env.mjs';
import { type JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      access_token: string;
    };
  }

  interface SpotifyToken extends JWT {}
}

export const authOptions: AuthOptions = {
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  session: {
    maxAge: 60 * 60, // 1 hour
  },
  providers: [
    SpotifyProvider({
      authorization: {
        params: {
          scope: 'user-read-email user-library-read',
        },
      },
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ account, token, user, session }) {
      console.log('-------------------- JWT Callback --------------------');
      //   console.log({ account, token, user, session });
      if (account) {
        token.access_token = account.access_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
      }
      const now = Math.floor(Date.now() / 1000);
      const difference = Math.floor(((token.expires_at as number) - now) / 60);
      console.log(`Token still active for ${difference} minutes.`);

      if (difference <= 10) return await refreshAccessToken(token);

      console.log('------------------------------------------------------');

      return token;
    },
    async session({ session, token }) {
      console.log('-------------------- Session Callback --------------------');
      //   console.log({ session, token });

      console.log('------------------------------------------------------');
      return { ...session, user: { ...session.user, access_token: token.access_token } };
    },
  },
};

async function refreshAccessToken(token: JWT) {
  console.log('Token expired, fetching new one...');
  console.log('refresh_token:', token.refresh_token);

  const request = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: `grant_type=refresh_token&refresh_token=${token.refresh_token}`,
    cache: 'no-cache',
  });

  if (request.ok) {
    const response = await request.json();

    console.log('Success, here is the response below:');
    console.log(response);

    const { access_token, expires_in, refresh_token } = response;

    // console.log(`New access token: ${access_token}`);

    // console.log({ access_token, expires_in, refresh_token });

    token.access_token = access_token;
    token.expires_at = Date.now() / 1000 + expires_in;
    if (refresh_token) {
      console.log('NEW REFRESH TOKEN');
      token.refresh_token = refresh_token;
    }
    return token;
  } else {
    console.error(`Failed to refresh token: ${request.status} ${request.statusText}`);
    console.error(await request.json());
    return token;
  }
}
