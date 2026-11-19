import Header from "@/components/Organisms/Header";
import Footer from "@/components/Organisms/Footer";

function AppLayout({ children } : { children: React.ReactNode }) {
    return(
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex flex-1 flex-col max-w-360 self-center p-10 mt-10 mb-20 w-10/12 bg-page">{children}</main>
            <Footer />
        </div>
    );
}

export default AppLayout;