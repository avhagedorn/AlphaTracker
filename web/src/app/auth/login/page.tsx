"use client";

import React from 'react';
import login from './lib';

export default function LoginPage() {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await login({
      username: data.get('username') as string,
      password: data.get('password') as string,
    });
    if (response) {
      window.location.href = '/home';
    } else {
      alert('Invalid username or password');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              placeholder="Enter your username"
              minLength={4}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              placeholder="Enter your password"
              minLength={8}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <p>
                No account?{" "}
                <a href="/auth/register" className="text-emerald-500 hover:text-emerald-600">
                    Register
                </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
