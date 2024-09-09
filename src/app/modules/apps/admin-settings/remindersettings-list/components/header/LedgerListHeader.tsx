import { LedgerListSearchComponent } from "./LedgerListSearchComponent";
import { KTCardBody } from "../../../../../../../_metronic/helpers";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  setLedgerTypeFilter: (type: number) => void;
  setBearingTypeFilter: (type: number) => void;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  searchTerm: string;
  ledgerTypeFilter: number;
  bearingTypeFilter: number;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
}

const LedgerListHeader = ({
  setSearchTerm,
  setLedgerTypeFilter,
  setIsFilterApplied,
  searchTerm,
  isFilterApplied,
  ledgerTypeFilter,
  setBearingTypeFilter,
  bearingTypeFilter,
  setSearchCounter
}: ComponentProps) => {
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <LedgerListSearchComponent
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setLedgerTypeFilter={setLedgerTypeFilter}
          setIsFilterApplied={setIsFilterApplied}
          setBearingTypeFilter={setBearingTypeFilter}
          bearingTypeFilter={bearingTypeFilter}
          isFilterApplied={isFilterApplied}
          ledgerTypeFilter={ledgerTypeFilter}
          setSearchCounter={setSearchCounter}
        />
      </div>
    </KTCardBody>
  );
};

export { LedgerListHeader };
