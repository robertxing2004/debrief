import Profile from "./profile";

export default async function Page({ params }: { params: { username: string } }) {
  return (
    <Profile params={{
      username: params.username
    }}>
    </Profile>
  )
}