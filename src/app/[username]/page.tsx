import Profile from "./profile";
import Chat from "./chat";

export default async function Page({ params }: { params: { username: string } }) {
  return (
    <div>
      <Profile params={{
        username: params.username
      }}>
      </Profile>
      <Chat/>
    </div>
  )
}