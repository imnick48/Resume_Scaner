import LoginForm from "../Components/login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
