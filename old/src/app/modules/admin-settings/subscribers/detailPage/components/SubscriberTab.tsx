import { SubscriberDetail } from "./cards/SubscriberDetail";
import { FinancialAccount } from "./cards/FinancialAccount";
import { DeleteSubscriber } from "./cards/DeleteSubscriber";
import { Content } from "../../../../../../_metronic/layout/components/content";
import { FormikProps } from "formik";
import { SubscriberSingle } from "../../core/_models";
interface props {
  formik: FormikProps<SubscriberSingle>;
  isLoading: boolean;
}
const SubscriberTab = ({ formik, isLoading }: props) => {
  return (
    <Content>
      <SubscriberDetail formik={formik} isLoading={isLoading} />
      <FinancialAccount formik={formik} />
      <DeleteSubscriber isLoading={isLoading} id={formik.values.id} />
    </Content>
  );
};

export { SubscriberTab };
