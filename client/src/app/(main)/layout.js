import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
