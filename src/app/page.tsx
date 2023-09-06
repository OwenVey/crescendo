import { SearchFilters } from '@/components/search-filters';

export default function IndexPage() {
  return (
    <div className="flex w-full flex-col bg-white dark:bg-gray-950 md:hidden">
      <SearchFilters />
    </div>
  );
}
