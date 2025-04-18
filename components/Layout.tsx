import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xs shadow-md sticky top-0 z-50">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">VideoPlatform</a>
        </Link>
        <nav className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          {session ? (
            <>
              <Link href="/dashboard">
                <a className="hover:underline">Dashboard</a>
              </Link>
              <Link href="/profile">
                <a className="hover:underline">Profile</a>
              </Link>
              <button
                onClick={() => signOut()}
                className="hover:underline text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/signin">
              <a className="hover:underline">Sign In</a>
            </Link>
          )}
        </nav>
      </header>
      <main className="p-4 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
