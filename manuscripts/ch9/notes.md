
The code above was fine initially, we only start to lose control of the component when consumers ask more to customise the tooltip. For example, user A might want a tooltip to show on the top of an avatar, while user B would like the ability to customise the background colour/font size of a tooltip, and so on.

Of course, we can either simply add some more props to Avatar like:

```tsx
<Avatar
  tooltipPosition="top"
  tooltipBackgroundColor="blue"
  tooltipColor="whitesmoke"
/>;
```

Or we expose a more flexible option object like:

```tsx
<Avatar
  tooltipProps={{
    position: "top",
    backgroundColor: "blue",
    color: "whitesmoke",
  }}
/>;
```

And then send it through to the underlying Tooltip component. But soon, we'll see some issues of this approach:

- avatar package includes Tooltip package, and it’s a relatively big package
- whenever a user wants to customise the Tooltip in some way, Avatar needs to adopt that change too
- any API changes from Tooltip may require a re-package in Avatar

But if we look at the Avatar component closer, we’ll notice Tooltip is more like a supplementary feature than an essential one (display an image for a user), and it is more like an optional feature. Thus we can simplify Avatar like the following code without a Tooltip:

```tsx
const Avatar = ({ name = "", url }: AvatarProps) => (
  <div className="rounded">
    <img src={url} alt={name} title={name} />
  </div>
);
```

It won’t break the definition of an avatar, but it will break the existing user experience (for example, inconsistency in this case) a bit. That’s the time for us to consider if we can/should split these two components and move Tooltip out of the package. It’s then up to the consumer to decide whether they need a Tooltip or not. In other words, we can make the code more composable.

So delete the tooltip from dependency, and the code turns into:

```tsx
import Avatar from "@xui/avatar";
import Tooltip from "@xui/tooltip";

const MyAvatar = (props) => (
  <Tooltip
    content="Juntao Qiu"
    position="top"
    css={{ color: "whitesmoke", backgroundColor: "blue" }}
  >
    <Avatar
      name="Juntao Qiu"
      url="https://avatars.githubusercontent.com/u/122324"
    />
  </Tooltip>
);
```

At a glance, it may not be too different from the previous one, but note here the snippet above is from Avatar’s consumer. That means the avatar component does not (and should not) know the existence of tooltips. For example, we can introduce tooltip from another package @material-ui/core/Tooltip and the functionality should be the same (except the user interface is changed a bit, of course):

```tsx
import Avatar from "@xui/avatar";
import Tooltip from "@material-ui/core/Tooltip";

const MyAvatar = (props) => (
  <Tooltip title="Juntao Qiu" placement="top" classes={...}>
    <Avatar
      name="Juntao Qiu"
      url="https://avatars.githubusercontent.com/u/122324"
    />
  </Tooltip>
);
```

So what does that mean? To the avatar’s consumer now, tooltip is not a black box that bonds with the avatar anymore. Also, this the more composable approach and has the following benefits too:

- the bundle size is much smaller for the avatar itself
- the consumer only pay for what they need

avatar does not bond to any specific tooltip implementation anymore, so consumers can choose other tooltip as they like.
