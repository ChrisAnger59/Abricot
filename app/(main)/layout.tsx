import Header from "@/components/Organisms/Header";
import Footer from "@/components/Organisms/Footer";

function AppLayout({ children } : { children: React.ReactNode }) {
    return(
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

export default AppLayout;