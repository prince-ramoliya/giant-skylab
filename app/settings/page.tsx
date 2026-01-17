import { getSettings, updateSettings } from "@/actions/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Save } from "lucide-react";

export default async function SettingsPage() {
    const settings = await getSettings();

    async function saveSettings(formData: FormData) {
        "use server";
        const companyName = formData.get("companyName") as string;
        const companyGst = formData.get("companyGst") as string;
        const companyAddress = formData.get("companyAddress") as string;
        await updateSettings({ companyName, companyGst, companyAddress });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={saveSettings} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company Name</label>
                                <Input name="companyName" defaultValue={settings.companyName} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GST Number</label>
                                <Input name="companyGst" defaultValue={settings.companyGst || ""} placeholder="e.g. 24ABCDE1234F1Z5" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Address</label>
                                <Input name="companyAddress" defaultValue={settings.companyAddress || ""} placeholder="Shop No, Street, City, State - PIN" />
                            </div>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
