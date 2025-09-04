import { UnitTypesModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import { UNIT_TYPES } from "./constants";

interface PartialResult extends Partial<UnitTypesModel> {}

export function getUnitTypes(searchTerm: string, pageIndex: number) {
  return postRequest<UnitTypesModel>(
    `${UNIT_TYPES}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
    },
    true
  );
}

export function getUnitTypesById(editModalId: number) {
  return getRequest<PartialResult>(`${UNIT_TYPES}/${editModalId}`, true);
}

export function postUnitType(id: number, title: string, isDefault: boolean) {
  return postRequest<PartialResult>(
    UNIT_TYPES,
    {
      id: id,
      title: title,
      isDefault: isDefault,
    },
    true
  );
}

export function deleteUnitType(ids: number[]) {
  return deleteRequest<PartialResult>(UNIT_TYPES, ids, true);
}
