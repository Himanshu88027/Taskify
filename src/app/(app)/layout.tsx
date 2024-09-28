import { Navbar } from "./_components/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Navbar />
        <div className="font-monkey font-semibold pt-[120px] sm:pt-[88px] relative min-h-screen bg-[#d9d9d9]">
          {children}
        </div>
    </>
  );
}

//88
