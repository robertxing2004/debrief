export default function Layout({children, chat, profile}: {
  children: React.ReactNode
  chat: React.ReactNode
  profile: React.ReactNode
}, ) {
  return (
    <>
      {children}
      {chat}
      {profile}
    </>
  )
}