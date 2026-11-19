import { Suspense } from "react";
import AccountInfo from "@/components/Organisms/AccountInfo";


function AccountPage() {
    return (
        <section className="bg-surface rounded-card border border-border p-16">
            <Suspense fallback={<p>Chargement...</p>}>
                <AccountInfo />
            </Suspense>
        </section>
    );
}

export default AccountPage;