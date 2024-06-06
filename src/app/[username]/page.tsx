import { redirect } from "next/navigation";
import { logout } from "../api/logout/route"
import { lucia, getUser } from "../../lib/auth"

export default async function Page({ params }: { params: { username: string } }) {
  // check lucia for user session
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