import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* hero text */}
      <div>
        <h1 className="text-3xl ml-[25vw] mr-[50vw] mt-[30vh] pl-8 p-3 rounded-[4em] bg-text-receive">debrief.</h1>
      </div>

      {/* github login button */}
      <div>
        <h1>Sign in</h1>
        <a className="ml-[25vw] p-2 rounded-[0.5em] bg-text-receive" href="/login/github ">Sign in with GitHub</a>
      </div>
    </main>
  );
}
