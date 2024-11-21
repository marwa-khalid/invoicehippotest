import { ClientSearchComponent } from "./ClientSearchComponent";
import { KTCardBody } from "../../../../../../../_metronic/helpers";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setPageIndex: (type: number) => void;
}

const ClientHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setPageIndex,
}: ComponentProps) => {
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <ClientSearchComponent
          setSearchTerm={setSearchTerm}
          setSearchCounter={setSearchCounter}
          searchTerm={searchTerm}
          setPageIndex={setPageIndex}
        />
      </div>
    </KTCardBody>
  );
};

export { ClientHeader };
