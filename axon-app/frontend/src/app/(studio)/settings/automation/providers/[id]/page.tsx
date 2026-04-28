import { AutomationProviderStudioContainer } from "@/modules/studio/features/automation-provider-studio/ui/AutomationProviderStudioContainer";
import { AutomationProvider } from "@/shared/domain/settings";

/**
 * We fetch data server-side before rendering the studio.
 */
async function getProvider(id: string): Promise<AutomationProvider | null> {
    try {
        const res = await fetch(`http://localhost:8000/settings/automation-providers/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        
        if (!res.ok) {
            console.error(`Failed to fetch automation provider: ${res.status}`);
            return null;
        }

        const data = await res.json();
        return data as AutomationProvider;
    } catch (e) {
        console.error("Error fetching automation provider:", e);
        return null;
    }
}

export default async function EditAutomationProviderStudioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const provider = await getProvider(id);

    if (!provider) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono text-sm">
                Błąd: Nie znaleziono dostawcy automatyzacji (ID: {id})
            </div>
        );
    }

    const initialData = {
        platform: provider.platform,
        base_url: provider.base_url || "",
        auth_type: provider.auth_type,
        auth_header_name: provider.auth_header_name || "",
        auth_secret: provider.auth_secret || "",
    };

    return <AutomationProviderStudioContainer providerId={provider.id} initialData={initialData} />;
}
