import withAutoClose from "./withAutoClose";
import { ExpandablePanel } from "./ExpandablePanel";
import withKeyboardToggle from "./withKeyboard";

// export default withAutoClose(ExpandablePanel, 3000);

export default withAutoClose(withKeyboardToggle(ExpandablePanel), 2000);
