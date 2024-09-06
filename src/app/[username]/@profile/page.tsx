import { redirect } from "next/navigation";
import { getUser, lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function Profile({ params }: { params: { username: string } }) {
  
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

  // check lucia for user session
  const user = await getUser();
	if (!user) {
		redirect("/login");
	}

  else {
    const res = await fetch(`http://localhost:3000/api/user/${params.username}`);
    const data = await res.json();

    return (
      <div className="w-3/12 position-absolute">
        <div>
          <h1 className="">this is the user page for {params.username}</h1>
        </div>
        <div>
          <img className="rounded-full w-12" src={data.avatar_url}/>
        </div>
        <div>
          <form action={logout}>
            <button>Sign out</button>
          </form>
        </div>
      </div>
    );
  }
}

interface ActionResult {
	error: string | null;
}