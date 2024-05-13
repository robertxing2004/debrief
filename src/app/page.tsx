import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* hero text */}
      <div>
        <h1 className="text-3xl ml-[25vw] mr-[50vw] mt-[30vh] pl-8 p-3 rounded-[4em] bg-text-receive">debrief.</h1>
        <h2 className="text-base">{process.env.GITHUB_ID}</h2>
      </div>

      {/* github login button */}
      <div>
      </div>
    </main>
  );
}
