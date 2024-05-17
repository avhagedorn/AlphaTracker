import dynamic from "next/dynamic";

export const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
    ssr: false,
    loading: () => null,
});
