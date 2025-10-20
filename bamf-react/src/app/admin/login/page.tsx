import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full h-full flex flex-col justify-center items-center gap-6">
                <AdminLoginForm />
            </div>
        </div>
    );
}