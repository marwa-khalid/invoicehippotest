import { QuoteSearchComponent } from "./QuoteSearchComponent";
import { KTCardBody } from "../../../../../../../_metronic/helpers";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setPeriodValueType: (type: number | null) => void;
  periodValueType: number | null;
  setQuoteStatusTypes: (types: any) => void;
  quoteStatusTypes: any;
  setClientIdForFilter: (type: number | null) => void;
  clientIdForFilter: number | null;
  year: number | null;
  setYear: (year: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  clientName: string;
  setTempClientId: (type: number | null) => void;
  tempClientId: number | null;
}

const FinancialListHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setPeriodValueType,
  periodValueType,
  setQuoteStatusTypes,
  quoteStatusTypes,
  setClientIdForFilter,
  clientIdForFilter,
  year,
  setShowClientSearch,
  setYear,
  setClientName,
  clientName,
  setTempClientId,
  tempClientId,
}: ComponentProps) => {
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <QuoteSearchComponent
          setSearchTerm={setSearchTerm}
          setPeriodValueType={setPeriodValueType}
          periodValueType={periodValueType}
          setQuoteStatusTypes={setQuoteStatusTypes}
          quoteStatusTypes={quoteStatusTypes}
          setClientIdForFilter={setClientIdForFilter}
          clientIdForFilter={clientIdForFilter}
          setSearchCounter={setSearchCounter}
          searchTerm={searchTerm}
          year={year}
          setYear={setYear}
          setShowClientSearch={setShowClientSearch}
          clientName={clientName}
          setClientName={setClientName}
          tempClientId={tempClientId}
          setTempClientId={setTempClientId}
        />
      </div>
    </KTCardBody>
  );
};

export { FinancialListHeader };
