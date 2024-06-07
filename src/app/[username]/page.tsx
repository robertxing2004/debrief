import { redirect } from "next/navigation";
import { logout } from "../api/logout/route";
import { getUser } from "../../lib/auth";

export default async function Page({ params }: { params: { username: string } }) {
  
  // check lucia for user session
  const user = await getUser();
	if (!user) {
		redirect("/login");
	}
  else {
    const res = await fetch(`http://localhost:3000/api/user/${params.username}`);
    const data = await res.json();

    return (
      <main>
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
      </main>
    );
  }
}