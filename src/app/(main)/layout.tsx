import { ReactNode } from "react";
import { Header } from "@/app/(main)/_header/header";

export default async function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div>{children}</div>
      {/* <Footer /> */}
    </div>
  );
}
