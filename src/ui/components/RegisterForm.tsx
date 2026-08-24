"use client";

import { FirebaseError } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

type FormValues = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const DefaultValues: FormValues = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export function RegisterForm() {
	const router = useRouter();

	const [formValues, setFormValues] = useState<FormValues>(DefaultValues);
	const [errors, setErrors] = useState<string[]>([]);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setErrors([]);

		if (formValues.password !== formValues.confirmPassword) {
			setErrors(["Passwords do not match."]);
			return;
		}

		if (formValues.password.length < 6) {
			setErrors(["Password must be at least 6 characters."]);
			return;
		}

		setIsLoading(true);

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				formValues.email,
				formValues.password,
			);

			await updateProfile(userCredential.user, {
				displayName: formValues.name,
			});

			router.replace("/");
		} catch (error: unknown) {
			let message = "Unable to create your account. Please try again.";

			if (error instanceof FirebaseError) {
				switch (error.code) {
					case "auth/email-already-in-use":
						message = "An account already exists with this email.";
						break;

					case "auth/invalid-email":
						message = "Please enter a valid email address.";
						break;

					case "auth/weak-password":
						message = "Your password is too weak. Please choose a stronger password.";
						break;

					case "auth/network-request-failed":
						message = "Network error. Please check your internet connection.";
						break;

					case "auth/operation-not-allowed":
						message = "Email/password registration is not enabled in Firebase.";
						break;
				}
			}

			setErrors([message]);
		} finally {
			setIsLoading(false);
		}
	};

	const googleRegisterHandler = async () => {
		setErrors([]);
		setIsGoogleLoading(true);

		try {
			const provider = new GoogleAuthProvider();

			await signInWithPopup(auth, provider);

			router.replace("/");
		} catch (error: unknown) {
			let message = "Unable to continue with Google. Please try again.";

			if (error instanceof FirebaseError) {
				switch (error.code) {
					case "auth/popup-closed-by-user":
						message = "Google sign-up was cancelled.";
						break;

					case "auth/popup-blocked":
						message = "Your browser blocked the Google sign-in popup.";
						break;

					case "auth/network-request-failed":
						message = "Network error. Please check your internet connection.";
						break;

					case "auth/account-exists-with-different-credential":
						message = "An account already exists with this email using a different sign-in method.";
						break;
				}
			}

			setErrors([message]);
		} finally {
			setIsGoogleLoading(false);
		}
	};

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget;

		setFormValues((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors.length > 0) {
			setErrors([]);
		}
	};

	const isBusy = isLoading || isGoogleLoading;

	return (
		<div className="w-full">
			<div className="mx-auto w-full max-w-md">
				{/* Logo */}
				<div className="mb-10 text-center">
					<Link href="/" className="inline-block text-3xl font-bold tracking-tight text-neutral-900">
						AllTheCart
					</Link>

					<h1 className="mt-8 text-3xl font-semibold tracking-tight text-neutral-900">Create your account</h1>

					<p className="mt-2 text-sm text-neutral-500">Join AllTheCart today</p>
				</div>

				{/* Card */}
				<div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
					{/* Errors */}
					{errors.length > 0 && (
						<div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
							{errors.map((error, index) => (
								<p key={`${error}-${index}`} className="text-sm text-red-600">
									{error}
								</p>
							))}
						</div>
					)}

					{/* Google */}
					<button
						type="button"
						onClick={googleRegisterHandler}
						disabled={isBusy}
						className="
							flex
							w-full
							items-center
							justify-center
							gap-3
							rounded-lg
							border
							border-neutral-300
							bg-white
							px-4
							py-3
							text-sm
							font-semibold
							text-neutral-800
							transition
							hover:bg-neutral-50
							disabled:cursor-not-allowed
							disabled:opacity-60
						"
					>
						{isGoogleLoading ? (
							<>
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
								Creating account...
							</>
						) : (
							<>
								<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
									<path
										fill="#4285F4"
										d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.32h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.43Z"
									/>
									<path
										fill="#34A853"
										d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.6Z"
									/>
									<path
										fill="#FBBC05"
										d="M6.53 13.69A5.85 5.85 0 0 1 6.22 12c0-.59.11-1.16.31-1.69V7.78H3.28A9.6 9.6 0 0 0 2.25 12c0 1.53.37 2.98 1.03 4.22l3.25-2.53Z"
									/>
									<path
										fill="#EA4335"
										d="M12 6.28c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.38 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53C7.3 8 9.46 6.28 12 6.28Z"
									/>
								</svg>
								Continue with Google
							</>
						)}
					</button>

					{/* Divider */}
					<div className="my-6 flex items-center gap-4">
						<div className="h-px flex-1 bg-neutral-200" />

						<span className="text-xs text-neutral-400">OR</span>

						<div className="h-px flex-1 bg-neutral-200" />
					</div>

					{/* Form */}
					<form onSubmit={submitHandler} className="space-y-5">
						{/* Name */}
						<div>
							<label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-800">
								Full name
							</label>

							<input
								id="name"
								type="text"
								name="name"
								autoComplete="name"
								placeholder="Your name"
								required
								disabled={isBusy}
								value={formValues.name}
								onChange={changeHandler}
								className="
									w-full rounded-lg border
									border-neutral-300 bg-white
									px-4 py-3 text-sm
									text-neutral-900 outline-none
									placeholder:text-neutral-400
									focus:border-neutral-900
									focus:ring-2
									focus:ring-neutral-900/10
									disabled:bg-neutral-50
								"
							/>
						</div>

						{/* Email */}
						<div>
							<label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-800">
								Email address
							</label>

							<input
								id="email"
								type="email"
								name="email"
								autoComplete="email"
								placeholder="you@example.com"
								required
								disabled={isBusy}
								value={formValues.email}
								onChange={changeHandler}
								className="
									w-full rounded-lg border
									border-neutral-300 bg-white
									px-4 py-3 text-sm
									text-neutral-900 outline-none
									placeholder:text-neutral-400
									focus:border-neutral-900
									focus:ring-2
									focus:ring-neutral-900/10
									disabled:bg-neutral-50
								"
							/>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-800">
								Password
							</label>

							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									name="password"
									autoComplete="new-password"
									placeholder="Create a password"
									required
									disabled={isBusy}
									value={formValues.password}
									onChange={changeHandler}
									className="
										w-full rounded-lg border
										border-neutral-300 bg-white
										px-4 py-3 pr-20 text-sm
										text-neutral-900 outline-none
										placeholder:text-neutral-400
										focus:border-neutral-900
										focus:ring-2
										focus:ring-neutral-900/10
										disabled:bg-neutral-50
									"
								/>

								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									disabled={isBusy}
									className="
										absolute right-3 top-1/2
										-translate-y-1/2 text-sm
										font-medium text-neutral-500
										hover:text-neutral-900
									"
								>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div>
							<label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-neutral-800">
								Confirm password
							</label>

							<div className="relative">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									autoComplete="new-password"
									placeholder="Confirm your password"
									required
									disabled={isBusy}
									value={formValues.confirmPassword}
									onChange={changeHandler}
									className="
										w-full rounded-lg border
										border-neutral-300 bg-white
										px-4 py-3 pr-20 text-sm
										text-neutral-900 outline-none
										placeholder:text-neutral-400
										focus:border-neutral-900
										focus:ring-2
										focus:ring-neutral-900/10
										disabled:bg-neutral-50
									"
								/>

								<button
									type="button"
									onClick={() => setShowConfirmPassword((prev) => !prev)}
									disabled={isBusy}
									className="
										absolute right-3 top-1/2
										-translate-y-1/2 text-sm
										font-medium text-neutral-500
										hover:text-neutral-900
									"
								>
									{showConfirmPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{/* Register */}
						<button
							type="submit"
							disabled={isBusy}
							className="
								flex w-full items-center
								justify-center gap-2 rounded-lg
								bg-neutral-900 px-4 py-3
								text-sm font-semibold text-white
								transition hover:bg-neutral-800
								focus:outline-none
								focus:ring-2 focus:ring-neutral-900
								focus:ring-offset-2
								disabled:cursor-not-allowed
								disabled:opacity-60
							"
						>
							{isLoading && (
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
							)}

							{isLoading ? "Creating account..." : "Create account"}
						</button>
					</form>

					{/* Login */}
					<div className="mt-6 border-t border-neutral-200 pt-6 text-center">
						<p className="text-sm text-neutral-500">
							Already have an account?{" "}
							<Link href="/login" className="font-semibold text-neutral-900 hover:underline">
								Sign in
							</Link>
						</p>
					</div>
				</div>

				{/* Footer */}
				<p className="mt-6 text-center text-xs text-neutral-400">
					By creating an account, you agree to our{" "}
					<Link href="/terms" className="underline hover:text-neutral-600">
						Terms
					</Link>{" "}
					and{" "}
					<Link href="/privacy" className="underline hover:text-neutral-600">
						Privacy Policy
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
