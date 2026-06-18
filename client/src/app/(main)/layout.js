import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
