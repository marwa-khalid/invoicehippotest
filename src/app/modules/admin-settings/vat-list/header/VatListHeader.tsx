import { VatListSearchComponent } from "./VatListSearchComponent";
import { KTCardBody } from "../../../../../_metronic/helpers";
interface ComponentProps {
  setSearchTerm: (term: string) => void;
  setVatAreaUsageTypeFilter: (type: number) => void;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  searchTerm: string;
  vatAreaUsageTypeFilter: number;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setPageIndex: (type: number) => void;
}

const VatListHeader = ({
  setSearchTerm,
  setVatAreaUsageTypeFilter,
  setIsFilterApplied,
  setSearchCounter,
  searchTerm,
  isFilterApplied,
  vatAreaUsageTypeFilter,
  setPageIndex,
}: ComponentProps) => {
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <VatListSearchComponent
          setSearchTerm={setSearchTerm}
          setSearchCounter={setSearchCounter}
          searchTerm={searchTerm}
          setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
          setIsFilterApplied={setIsFilterApplied}
          isFilterApplied={isFilterApplied}
          vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
          setPageIndex={setPageIndex}
        />
      </div>
    </KTCardBody>
  );
};

export { VatListHeader };
