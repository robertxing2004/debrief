import { redirect } from "next/navigation";
import { getUser } from "../../lib/auth"

export default async function Page({ params }: { params: { github_id: string } }) {
  const user = await getUser();
	if (!user) {
		redirect("/login");
	}
  else {
    return (
      <div>
        this is the user page for {params.github_id}
      </div>
    );
  }
}