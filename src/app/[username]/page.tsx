import { redirect } from "next/navigation";
import { lucia, getUser } from "../../lib/auth"
import { cookies } from "next/headers";

export default async function Page({ params }: { params: { username: string } }) {
  const user = await getUser();
	if (!user) {
		redirect("/login");
	}
  else {
    return (
      <main>
        <div>
          <h1 className="">this is the user page for {params.username}</h1>
        </div>
        <div>
          <form action={logout}>
            <button>Sign out</button>
          </form>
        </div>
      </main>
    );
  }
}

async function logout(): Promise<ActionResult> {
	"use server";
	const session = await getUser();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
}

interface ActionResult {
	error: string | null;
}