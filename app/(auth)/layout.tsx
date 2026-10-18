function AuthLayout({ children, image } : { children: React.ReactNode; image: React.ReactNode }) {
    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[2fr_3fr]">
            <section className="flex items-center justify-center bg-page px-6 py-12">
                {children}
            </section>

            <div className="relative hidden lg:block">
                {image}
            </div>
        </div>
    );
}

export default AuthLayout;