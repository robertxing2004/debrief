import { Octokit } from '@octokit/core';
import { OAuth2RequestError } from 'arctic';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// get profile data via github rest api
export async function GET(request: Request, { params }: { params: { username: string }}) {
  try {
    // get access token from db
    const { rows } = await pool.query(
      'SELECT access_token as token FROM auth_user WHERE username = $1',
      [params.username]
    );
    const res = rows.length > 0 ? rows[0] : null;

    // get authenticated user data from github rest api
    if(res && res.token) {
      const octokit = new Octokit({
        auth: res.token
      });
      const { data } = await octokit.request('GET /user', {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      const response =  NextResponse.json(data);
      response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=59');
      return response;
    } else {
      const response = NextResponse.json({ message: 'User not found or no access token available' }, { status: 404 });
      response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
      return response;
    }
  }
  catch(e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}