"use client";

import { Fragment } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon, Package, LogIn, UserPlus, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/ui/components/AuthProvider";

export function UserMenu() {
	const { user, loading } = useAuth();

	if (loading) {
		return <div className="h-6 w-6 animate-pulse rounded-full bg-neutral-200" />;
	}

	/*
	 * User is NOT logged in
	 */
	if (!user) {
		return (
			<Menu as="div" className="relative">
				<Menu.Button
					className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-900 focus:outline-none"
					aria-label="Account menu"
				>
					<UserIcon className="h-6 w-6" aria-hidden="true" />
				</Menu.Button>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-neutral-200 bg-white py-1 shadow-lg focus:outline-none">
						<div className="flex flex-col px-1 py-1">
							<Menu.Item>
								{({ active }) => (
									<Link
										href="/login"
										className={clsx(
											active && "bg-neutral-100",
											"flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700",
										)}
									>
										<LogIn className="h-4 w-4" />
										Login
									</Link>
								)}
							</Menu.Item>

							<Menu.Item>
								{({ active }) => (
									<Link
										href="/register"
										className={clsx(
											active && "bg-neutral-100",
											"flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700",
										)}
									>
										<UserPlus className="h-4 w-4" />
										Create account
									</Link>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		);
	}

	/*
	 * User IS logged in
	 */
	return (
		<Menu as="div" className="relative">
			<Menu.Button
				className="relative flex rounded-full bg-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
				aria-label="Account menu"
			>
				<span className="sr-only">Open user menu</span>

				{user.photoURL ? (
					<img
						src={user.photoURL}
						alt={user.displayName || "Account"}
						className="h-8 w-8 rounded-full object-cover"
					/>
				) : (
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white">
						<UserIcon className="h-4 w-4" />
					</div>
				)}
			</Menu.Button>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-50 mt-2 w-60 origin-top-right divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg focus:outline-none">
					{/* User information */}
					<div className="px-4 py-3">
						<p className="truncate text-sm font-semibold text-neutral-900">{user.displayName || "Account"}</p>

						{user.email && <p className="mt-1 truncate text-xs text-neutral-500">{user.email}</p>}
					</div>

					{/* Account links */}
					<div className="flex flex-col px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									href="/account/profile"
									className={clsx(
										active && "bg-neutral-100",
										"flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700",
									)}
								>
									<UserIcon className="h-4 w-4" />
									Profile
								</Link>
							)}
						</Menu.Item>

						<Menu.Item>
							{({ active }) => (
								<Link
									href="/orders"
									className={clsx(
										active && "bg-neutral-100",
										"flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700",
									)}
								>
									<Package className="h-4 w-4" />
									My orders
								</Link>
							)}
						</Menu.Item>
					</div>

					{/* Logout */}
					<div className="flex flex-col px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<button
									type="button"
									onClick={() => signOut(auth)}
									className={clsx(
										active && "bg-red-50",
										"flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-start text-sm font-medium text-red-600",
									)}
								>
									<LogOut className="h-4 w-4" />
									Sign out
								</button>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
