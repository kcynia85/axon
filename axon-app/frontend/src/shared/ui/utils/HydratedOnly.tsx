"use client";

import { useEffect, useState, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * HydratedOnly: Ensures children are only rendered on the client after hydration.
 * Prevents hydration mismatches for components that rely on browser-only state
 * or dynamic data that isn't available during SSR.
 */
export const HydratedOnly = ({ children, fallback = null }: Props) => {
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		// biome-ignore lint/correctness/useExhaustiveDependencies: intentional on mount
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setHasHydrated(true);
	}, []);

	if (!hasHydrated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};
