import { Suspense } from "react";
import AccountInfo from "@/components/Organisms/AccountInfo";

function AccountPage() {
    return (
        <section>
            <h1>Page de profil</h1>
            <Suspense fallback={<p>Chargement...</p>}>
                <AccountInfo />
            </Suspense>
        </section>
    );
}

export default AccountPage;