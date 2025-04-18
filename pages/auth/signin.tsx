import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";
import Layout from "../../components/Layout";

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  const [email, setEmail] = useState("");

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-3xl shadow glass">
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>
        <form
          method="post"
          action="/api/auth/callback/email"
          className="flex flex-col gap-4"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label className="flex flex-col">
            <span className="mb-1 text-gray-700 dark:text-gray-300">Email</span>
            <input
              type="email"
              name="email"
              required
              className="rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="bg-primary text-white rounded-md py-2 font-semibold hover:bg-primary/90 transition"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </Layout>
  );
}

SignIn.getInitialProps = async (context: any) => {
  return {
    csrfToken: await getCsrfToken(context),
  };
};
