import Navbar from "@/components/public/Navbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
