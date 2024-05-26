import { github, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { GitHub, OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import pool from "../../../../lib/db"

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies().get("github_oauth_state")?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		{/*/ Replace this with your own DB client.*/}
		//const existingUser = await db.table("user").where("github_id", "=", githubUser.id).get();
    
		// does this work LOL
		const { rows } = await pool.query<GitHubUser>(`
			SELECT id, username as login FROM auth_user WHERE github_id = ${githubUser.id}
		`);

		const existingUser: GitHubUser | null = rows.length > 0 ? rows[0] : null;


		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return new Response(null, {
				status: 302,
				headers: {
					Location: `/[${existingUser.id}]` // redirect to user page
				}
			});
		}

		const userId = generateIdFromEntropySize(10); // 16 characters long

		{/* Replace this with your own DB client.
		await db.table("user").insert({
			id: userId,
			github_id: githubUser.id,
			username: githubUser.login
		});
    */}
		
		// i believe this works
		await pool.query(
			`INSERT INTO auth_user(id, github_id, username) VALUES($1, $2, $3)`,
			[userId, githubUser.id, githubUser.login]
		);

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/[${githubUser.id}]` // redirect to user page
			}
		});
	} catch (e) {
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

interface GitHubUser {
	id: string;
	login: string;
}