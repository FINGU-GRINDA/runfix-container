import { TranslationDashboard } from "../components/translation-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-800">
        <h1 className="text-xl font-semibold">Translation Dashboard</h1>
      </header>
      <TranslationDashboard />
    </main>
  );
}
