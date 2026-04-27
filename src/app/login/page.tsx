import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            AADHI CARS PVT LTD
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Fuel Indent & Gatepass Management
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
