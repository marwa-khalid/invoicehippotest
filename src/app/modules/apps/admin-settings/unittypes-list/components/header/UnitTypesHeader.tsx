import { UnitTypesSearchComponent } from "./UnitTypesSearchComponent";
import { KTCardBody } from "../../../../../../../_metronic/helpers";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
}

const UnitTypesHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
}: ComponentProps) => {
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <UnitTypesSearchComponent
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setSearchCounter={setSearchCounter}
        />
      </div>
    </KTCardBody>
  );
};

export { UnitTypesHeader };
