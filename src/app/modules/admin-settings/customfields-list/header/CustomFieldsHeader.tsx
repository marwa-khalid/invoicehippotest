import { CustomFieldsSearchComponent } from "./CustomFieldsSearchComponent";
import { KTCardBody } from "../../../../../_metronic/helpers";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setFieldTypeFilter: (type: number) => void;
  setAreaTypeFilter: (type: number) => void;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  areaTypeFilter: number;
  fieldTypeFilter: number;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  setPageIndex: (type: number) => void;
}

const CustomFieldsHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  isFilterApplied,
  setAreaTypeFilter,
  setFieldTypeFilter,
  fieldTypeFilter,
  areaTypeFilter,
  setIsFilterApplied,
  setPageIndex,
}: ComponentProps) => {
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <CustomFieldsSearchComponent
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setSearchCounter={setSearchCounter}
          setFieldTypeFilter={setFieldTypeFilter}
          setAreaTypeFilter={setAreaTypeFilter}
          areaTypeFilter={areaTypeFilter}
          fieldTypeFilter={fieldTypeFilter}
          setIsFilterApplied={setIsFilterApplied}
          isFilterApplied={isFilterApplied}
          setPageIndex={setPageIndex}
        />
      </div>
    </KTCardBody>
  );
};

export { CustomFieldsHeader };
