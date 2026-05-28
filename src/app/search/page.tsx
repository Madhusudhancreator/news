export const dynamic = "force-dynamic";

import { Suspense } from "react";
import SearchResults from "./SearchResults";
import HomeLayout from "../../components/layouts/HomeLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function SearchPage() {
  return (
    <HomeLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <SearchResults />
      </Suspense>
    </HomeLayout>
  );
}
