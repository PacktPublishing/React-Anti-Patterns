import withAnalytics from "../../misc/hocs/withAnalytics";
import withLoading from "./withLoading";
import Button from "./Button";

const LoadingAnalyticsButton = withAnalytics(withLoading(Button));

export default LoadingAnalyticsButton;
