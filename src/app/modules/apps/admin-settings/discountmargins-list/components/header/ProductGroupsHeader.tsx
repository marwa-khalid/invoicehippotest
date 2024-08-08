import { ProductGroupsSearchComponent } from "./ProductGroupsSearchComponent";
import { KTCardBody } from "../../../../../../../_metronic/helpers";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
}

const ProductGroupsHeader = ({ setSearchTerm, searchTerm }: ComponentProps) => {
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <ProductGroupsSearchComponent
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      </div>
    </KTCardBody>
  );
};

export { ProductGroupsHeader };
