import { login, logout } from "@/app/actions";

export function LoginButton() {
  return (
    <form action={login}>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Sign In
      </button>
    </form>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm font-medium transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}