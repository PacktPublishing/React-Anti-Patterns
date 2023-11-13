type OrderContainerProps = {
  testID: string;
  orderData: Object;
  basketError: Error;
  addCoupon: () => void;
  voucherSelected: string;
  validationErrors: string[];
  clearErrors: () => void;
  removeLine: () => void;
  editLine: () => void;
  hideOrderButton: boolean;
  hideEditButton: boolean;
  loading: boolean;
};

const OrderContainer = ({
  testID,
  orderData,
  basketError,
  addCoupon,
  voucherSelected,
  validationErrors,
  clearErrors,
  removeLine,
  editLine,
  hideOrderButton,
  hideEditButton,
  loading,
}: OrderContainerProps) => {
  //..
};

export default OrderContainer;
