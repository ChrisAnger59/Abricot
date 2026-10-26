import { Suspense } from "react";
import AccountInfo from "@/components/Organisms/AccountInfo";


function AccountPage() {
    return (
        <section>
            <Suspense fallback={<p>Chargement...</p>}>
                <AccountInfo />
            </Suspense>
        </section>
    );
}

export default AccountPage;