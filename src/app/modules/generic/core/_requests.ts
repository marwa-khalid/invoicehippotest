import { getRequest } from "../../../../app/modules/auth/core/_apiservice";
import { TaskModel } from "./_models";
import { GET_TASKS } from "./constants";

export function getTasks() {
  return getRequest<TaskModel>(GET_TASKS, true);
}
