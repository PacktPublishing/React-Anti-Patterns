# Strategic UI Composition: Harnessing HOCs, Hooks, and Headless Components

Managing state in UI applications is a challenging endeavor. A part of this challenge stems from the many states one needs to manage. There are local states like `isOpen` or `selectedIndex`, states representing remote data like `loading`, `error`, `data`, and environmental states such as router paths, `isUserAuthorized`, and configurations like feature flags to determine the availability of certain features to the user.

Over time, developers have explored various strategies to tackle these challenges. Libraries like `redux` and `mobx` emerged as solutions, although they brought along their own set of problems. Similar issues befell the old context API, leading to the introduction of the new context API. Following that, libraries like `react-query`, `remix`, and others came up, each attempting to simplify certain complexities.

With specialized libraries targeting different aspects of state management, progress has been made. For instance, `react-query` significantly alleviates the challenges tied to asynchronous calls by providing features like caching, deduplication, retries, and error handling. Moreover, patterns like container/presentation components, higher-order components, and hooks have been adopted by developers to manage state. Each of these patterns has a role to play in both the problem and solution domains.

However, amidst these varying approaches, understanding the core problem and the rationale behind these solutions is crucial. It's relatively straightforward to follow a new pattern, but a deeper understanding of the 'why' behind these patterns will enable you to apply them more confidently in your specific use cases.

This article aims to delve into the fundamental problems and explore the various patterns that have evolved over time. Some of these patterns have stood the test of time and remain relevant, while others may have become somewhat awkward and are better avoided in future projects. Moreover, I'd like to propose a pattern that I've found to be particularly beneficial, especially for large and complex UI applications.

With that in mind, let's take a step back, maybe grab a coffee, and start with a basic yet powerful concept—higher-order functions (HOFs), setting the stage for our explorative journey into state management in React. 

## Starting with Higher-order Function

A higher-order function (HOF) is a concept borrowed from functional programming. It refers to a function that either accepts another function as an argument, returns a function, or both. This idea might initially seem perplexing, especially if you're coming from a traditional object-oriented programming background where this concept isn't as prevalent.

However, higher-order functions are incredibly useful tools in many scenarios. To illustrate, let’s consider a function, `printLineItem`, which outputs an item's name alongside its price:

```ts
const printLineItem = (item) => {
  return `Name: ${item.name} - Price: $${item.price}`;
};
```

Suppose you have an array of items, and we can call `printLineItem` to print out the formatted details:

```ts
const items = [
  { name: 'Apple', price: 1 },
  { name: 'Banana', price: 0.75 },
];

console.log(printLineItem(items[0]));
```

Now, let's say you want to add a header to this output, to better structure the information. You could achieve this by creating a higher-order function named `withHeader`. This function accepts another function (`contentFunc`) as an argument and returns a new function:

```ts
const withHeader = (contentFunc) => {
  return (...args) => {
    const header = "=== Header ===\n";
    return header + contentFunc(...args);
  };
};
```

Now you can pass `printLineItem` to `withHeader`, which in turn, returns a new function. This new function, when called, will output the item information prefixed with a header:

```ts
const report = withHeader(printLineItem);
console.log(report(items[0]));
```

It will output something like this:

```text
=== Header ===
Name: Apple - Price: $1
```

In this example, `withHeader` is a higher-order function that wraps around `printLineItem` to enhance its functionality, demonstrating a simple yet effective way to compose functions and extend their behavior.

Now, just as we created a `withHeader` function to add a header, let's create a `withFooter` function to append a footer to our output:

```ts
const withFooter = (contentFunc) => {
  return (...args) => {
    const footer = "\n=== Footer ===";
    return contentFunc(...args) + footer;
  };
};
```

We can now wrap `printLineItem` with both `withHeader` and `withFooter` to generate a detailed report for a single item:

```ts
const report = withFooter(withHeader(printLineItem));
console.log(report(items[0]));
```

The above code would print out something more informative:

```text
=== Header ===
Name: Apple - Price: $1
=== Footer ===
```

This composition enhances `printLineItem` without modifying its original implementation, showcasing the beauty of function composition. Furthermore, `withHeader` and `withFooter` remain agnostic to the nature of the wrapped function, a powerful feature of higher-order functions.

Suppose now we want to generate a report for all items in the array. We can create a new function, `printAllItems`, to achieve this:

```ts
const printAllItems = (items) => items.map(printLineItem).join('\n');

const report = withFooter(withHeader(printAllItems));
console.log(report(items));
```

By doing so, we've now created a report for multiple items without altering the implementations of `withHeader` or `withFooter`. This example exemplifies the loose coupling and composability inherent in higher-order functions. 

Observe that the higher-order functions withHeader and withFooter accept a function as input. The function they return maintains the same signature as the input function and can be utilized in the same manner as invoking the original function. This exemplifies a potent pattern that can be harnessed in various scenarios.

As we reflect on this, an intriguing question arises: Can we transfer this level of composability and functional elegance into our React applications? 

Indeed, the ability to enhance components is not exclusive to functions; we can achieve the same with React components, thanks to Higher-Order Components (HOCs). A Higher-Order Component is a function that takes a component as an argument and returns a new, enhanced component.

## Introducing Higher-order Components

The principle behind Higher-order Components (HOCs) is straightforward: they allow you to inject additional functionality into an existing component. This pattern is especially beneficial when you want to reuse certain behaviors across multiple components.

Let's delve into an example:

```tsx
const checkAuthorization = () => {
    // Perform authorization check, e.g., check local storage or send a request to a remote server
}

const withAuthorization = (Component: React.FC): React.FC => {
  return (props: any) => {
    const isAuthorized = checkAuthorization();
    return isAuthorized ? <Component {...props} /> : <Login />;
  };
};
```

In this snippet, we define a function `checkAuthorization` to handle the authorization check. Next, we create a Higher-Order Component `withAuthorization`. This HOC takes a component (`Component`) as its argument and returns a new function. This returned function, when rendered, will either render the original `Component` (if the user is authorized) or a `Login` component (if the user is not authorized).

Now, suppose we have a `ProfileComponent` that we want to secure. We can use `withAuthorization` to create a new, secured version of `ProfileComponent`:

```tsx
const Profile = withAuthorization(ProfileComponent);
```

Now, whenever `Profile` is rendered, it will first check if the user is authorized. If so, it renders `ProfileComponent`; otherwise, it redirects the user to the `Login` component.

Now that we've seen how higher-order components can control access with `withAuthorization`, let's shift our focus to enhancing user interactions. We'll delve into an `ExpandablePanel` component, showcasing how higher-order components can also manage interactive UI elements and state transitions.

### Implementing an ExpandablePanel Component

Let's kick things off with a basic ExpandablePanel component. This component, as the name suggests, consists of a title and a content area. Initially, the content area is collapsed, but with a click on the title, it expands to reveal the content.

![An expandable panel](images/expandable-panel.png)

The code for such a component is straightforward:

```tsx
export type PanelProps = {
  heading: string;
  content: ReactNode;
};

const ExpandablePanel = ({ heading, content }: PanelProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section>
      <header onClick={() => setIsOpen((isOpen) => !isOpen)}>{heading}</header>
      {isOpen && <main>{content}</main>}
    </section>
  );
};
```

Now, suppose we want to jazz it up a bit: make the panel expand automatically when rendered, and then collapse after a few seconds. Here's how we could adjust the code to achieve that:

```tsx
const AutoCloseExpandablePanel = ({ heading, content }: PanelProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  });

  return (
    <section>
      <header onClick={() => setIsOpen((isOpen) => !isOpen)}>{heading}</header>
      {isOpen && <main>{content}</main>}
    </section>
  );
};
```

In this revised version, we initialize `isOpen` to `true` so the panel starts expanded. Then we utilize `useEffect` to set a timer that collapses the panel after 3000 milliseconds (3 seconds).

This pattern of auto-collapsing components is quite common in UI development - think of notifications, alerts, or tooltips that disappear after a while. To promote code reusability, let's extract this auto-collapsing logic into a Higher-Order Component:

```tsx
interface Toggleable {
  isOpen: boolean;
  toggle: () => void;
}

const withAutoClose = <T extends Partial<Toggleable>>(
  Component: React.FC<T>,
  duration: number = 2000
) => (props: T) => {
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    if (show) {
      const timerId = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timerId);
    }
  }, [show]);

  return (
    <Component
      {...props}
      isOpen={show}
      toggle={() => setShow((show) => !show)}
    />
  );
};
```

In `withAutoClose`, we define a generic HOC that adds auto-closing functionality to any component. This HOC accepts a `duration` parameter to customize the auto-close delay, defaulting to 2000 milliseconds (2 seconds).

To ensure a smooth integration, we extend `PanelProps` to include optional `Toggleable` properties:

```tsx
type PanelProps = {
  heading: string;
  content: ReactNode;
}  & Partial<Toggleable>;
```

Now, we can refactor `ExpandablePanel` to accept `isOpen` and `toggle` props from `withAutoClose`:

```tsx
const ExpandablePanel = ({
  isOpen,
  toggle,
  heading,
  content,
}: PanelProps) => {
  return (
    <section>
      <header onClick={toggle}>{heading}</header>
      {isOpen && <main>{content}</main>}
    </section>
  );
};
```

With this setup, creating an auto-closing version of `ExpandablePanel` is a breeze:

```tsx
export default withAutoClose(ExpandablePanel, 3000);
```

And guess what? The auto-closing logic we've encapsulated in `withAutoClose` can be reused across various components:

```tsx
const AutoDismissToast = withAutoClose(Toast, 3000);
const TimedTooltip = withAutoClose(Tooltip, 3000);
```

The versatility of Higher-Order Components (HOCs) shines when it comes to composition - the ability to apply one HOC to the result of another. This capability aligns well with the principle of function composition in functional programming. Let's consider another HOC, `withKeyboardToggle`, which augments a panel's behavior to respond to keyboard inputs for toggling the panel's expanded/collapsed state.

Here's the code for `withKeyboardToggle`:

```tsx
const noop = () => {};

const withKeyboardToggle =
  <T extends Partial<Toggleable>>(Component: React.FC<T>) =>
  (props: T) => {
    const divRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        (props.toggle ?? noop)();
      }

      if (event.key === "Escape" && divRef.current) {
        divRef.current.blur();
      }
    };

    return (
      <div onKeyDown={handleKeyDown} tabIndex={0} ref={divRef}>
        <Component {...props} />
      </div>
    );
  };

export default withKeyboardToggle;
```

In the `withKeyboardToggle` HOC, a reference (`divRef`) is created for the wrapping `div` to enable keyboard interactions. The `handleKeyDown` function defines the behavior for the Enter, Space, and Escape keys. The Enter or Space keys toggle the panel's state, while the Escape key removes focus from the panel.

Now, let's compose `withKeyboardToggle` and `withAutoClose` together to create a new component `AccessibleAutoClosePanel`:

```tsx
const AccessibleAutoClosePanel = withAutoClose(withKeyboardToggle(ExpandablePanel), 2000);
```

In the expression `withAutoClose(withKeyboardToggle(ExpandablePanel), 2000);`, `withKeyboardToggle` is first applied to `ExpandablePanel`, enhancing it with keyboard toggle capability. The result is then fed into `withAutoClose`, which further enhances the component to auto-close after a 2000 millisecond delay. This chaining of HOCs results in a new component, `AccessibleAutoClosePanel`, which inherits both the keyboard toggle and auto-close behaviors. This is a vivid example of how HOCs can be nested and composed to build more complex behavior from simpler, single-responsibility components.

![Higher Order Component](images/higher-order-component.png)

If you have some background in object-oriented programming, this concept might resonate with you as it aligns with the decorator design pattern. Assuming you may not be familiar, I'll provide a simple refresher on this pattern since it's fundamental and we'll likely encounter it again.

--- *This can be used as a side note if too distracting* 

## A Refresher on the Decorator Pattern

At its core, the Decorator Pattern allows us to extend or alter the functionality of objects at run-time by wrapping them in a layer of a decorative class. This pattern is quite handy when you wish to adhere to the Open/Closed Principle, making your code open for extension but closed for modification.

Let's draw an analogy to better understand this concept. Consider a simple espresso coffee. In Object-Oriented terms, espresso can be seen as an instance of a `Coffee` interface. Now, if you wish to have a milk coffee instead, you could create a `MilkCoffee` class that also implements the `Coffee` interface while adding a twist of milk to the basic espresso. This alteration is done without breaking the contract of the `Coffee` interface. Under the umbrella of `MilkCoffee`, you could have multiple variations like Soy Latte, Almond Flat White, etc., each extending the functionality of the basic espresso, yet adhering to the `Coffee` interface.

![Decorator](images/decorator-coffee.png)

A class diagram would further elucidate the relationship between these entities. As depicted below, both the decorator (MilkCoffee) and the original class (Espresso) implement the `Coffee` interface. Each wrapper class (e.g., Soy Latte, Almond Flat White) encapsulates the Espresso and extends its functionality while remaining a `Coffee` type.

![Decorator](images/decorator-class-diagram.png)

Thus, regardless of how you choose to decorate your coffee, to the consumer, it remains a coffee. This pattern illustrates the essence of decorator pattern where each wrapper class enriches the functionality of the original class, all while preserving its original identity and contract.

---

Higher-Order Components (HOCs) are a powerful pattern for creating composable and reusable logic in your components. However, they come with their own set of advantages and drawbacks. Let's take a look:

### Pros of Higher-Order Components:

1. **Reusability:** HOCs enable you to extract and reuse common logic across multiple components, promoting DRY (Don't Repeat Yourself) principles.
2. **Composition:** They thrive in a system that favors composition, allowing developers to create enhanced components by composing multiple HOCs together.
3. **Separation of Concerns:** By isolating certain behaviors or logic into HOCs, they help in maintaining a clean separation of concerns.
4. **Abstraction:** They provide a level of abstraction that can help in organizing higher-level logic, aiding in the manageability of the code.

### Cons of Higher-Order Components:
1. **Prop Collision:** There's a risk of prop name collisions, where the HOC might override the props of the wrapped component or vice versa.
2. **Indirection:** They add layers of indirection to your component hierarchy, which might make debugging and maintenance more challenging.
3. **Complexity:** The composition of multiple HOCs can lead to a 'wrapper hell', where components are wrapped in multiple layers of HOCs, making the code harder to understand and follow.

Transitioning from Higher-Order Components, we now venture into Hooks — a newer and potent feature in React for handling state and effects in functional components. Up next, we'll unravel how Hooks provide a more straightforward approach to managing state and logic in your components.

## Exploring React Hooks

> ...With Hooks, you can extract stateful logic from a component so it can be tested independently and reused. Hooks allow you to reuse stateful logic without changing your component hierarchy...

Hooks provide a means to extract stateful logic from a component, enabling its independent testing and reuse. They pave the way for reutilizing stateful logic without altering your component hierarchy. Essentially, Hooks let you "hook into" React state and other lifecycle features from function components.

```tsx
const useAutoClose = (duration: number) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      const timerId = setTimeout(() => setIsOpen(false), duration);
      return () => clearTimeout(timerId);
    }
  }, [duration, isOpen]);

  const toggle = () => setIsOpen((show) => !show);

  return { isOpen, toggle };
};

export default useAutoClose;
```

In this `useAutoClose` hook, we create a state `isOpen` and a function `toggle` to switch the state. The `useEffect` function sets a timer to change `isOpen` to false after a specified duration, but only if `isOpen` is true. It also cleans up the timer to prevent memory leaks.

Now, to integrate this hook into our `ExpandablePanel`, minimal amendments are needed:

```tsx
const ExpandablePanel = ({ heading, content }: PanelProps) => {
  const { isOpen, toggle } = useAutoClose(2000);

  return (
    <section>
      <header onClick={toggle}>{heading}</header>
      {isOpen && <main>{content}</main>}
    </section>
  );
};
```
The `ExpandablePanel` now utilizes `useAutoClose`, seamlessly incorporating the auto-close functionality. Next, to incorporate keyboard navigation, we define another hook, `useKeyboard`, which captures key events to toggle the panel:

```tsx
const useKeyboard = (toggle: () => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return { handleKeyDown };
};
```

Embedding `useKeyboard` within `ExpandablePanel` is straightforward:

```tsx
const ExpandablePanel = ({ heading, content }: PanelProps) => {
  const { isOpen, toggle } = useAutoClose(2000);
  const { handleKeyDown } = useKeyboard(toggle);

  return (
    <section onKeyDown={handleKeyDown} tabIndex={0}>
      <header onClick={toggle}>{heading}</header>
      {isOpen && <main>{content}</main>}
    </section>
  );
};
```

Here, `handleKeyDown` from `useKeyboard` is employed to detect key presses, enhancing our component with keyboard interactivity.

![Using alternative hooks](images/hooks.png)

Hooks embody a neat package of reusable logic, isolated from the component, yet easily integrated. Unlike the wrapping approach of HOCs, hooks offer a plug-in mechanism, making them lightweight and well-managed by React. This characteristic of hooks not only promotes code modularity but also facilitates a cleaner and more intuitive way to enrich our components with additional functionalities.

As we have explored hooks and their capabilities in managing state and logic, let's apply this knowledge to build a more complex UI component from scratch — a dropdown list. This exercise will not only reinforce our understanding of hooks but also demonstrate their practical application in creating interactive UI elements. 

We'll start with a basic version of a dropdown list, then gradually introduce more features to make it functional and user-friendly. This process will also set the stage for a later discussion on headless components, showcasing a design pattern that further abstracts and manages state and logic in UI components.

## Implementing a Dropdown List

A dropdown list is a common component used in many places. Although there's a native select component for basic use cases, a more advanced version offering more control over each option provides a better user experience.

![Dropdown list component](images/dropdown-list.png)

Creating one from scratch, a complete implementation, requires more effort than it appears at first glance. It's essential to consider keyboard navigation, accessibility (for instance, screen reader compatibility), and usability on mobile devices, among others.

We'll begin with a simple, desktop version that only supports mouse clicks, and gradually build in more features to make it realistic. Note that the goal here is to reveal a few software design patterns rather than teach how to build a dropdown list for production use - actually, I don’t recommend doing this from scratch and would instead suggest using more mature libraries.

Basically, we need an element (let's call it a trigger) for the user to click, and a state to control the show and hide actions of a list panel. Initially, we hide the panel, and when the trigger is clicked, we show the list panel.

```jsx
import { useState } from "react";

interface Item {
  icon: string;
  text: string;
  description: string;
}

type DropdownProps = {
  items: Item[];
};

const Dropdown = ({ items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="dropdown">
      <div className="trigger" tabIndex={0} onClick={() => setIsOpen(!isOpen)}>
        <span className="selection">
          {selectedItem ? selectedItem.text : "Select an item..."}
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className="item-container"
            >
              <img src={item.icon} alt={item.text} />
              <div className="details">
                <div>{item.text}</div>
                <small>{item.description}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

In the code above, we've set up the basic structure for our dropdown component. Using the `useState` hook, we manage the `isOpen` and `selectedItem` states to control the dropdown's behavior. A simple click on the trigger toggles the dropdown menu, while selecting an item updates the `selectedItem` state.

Let's break down the component into smaller, manageable pieces to see it more clearly. We'll start by extracting a `Trigger` component to handle user clicks:

```tsx
const Trigger = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <div className="trigger" tabIndex={0} onClick={onClick}>
      <span className="selection">{label}</span>
    </div>
  );
};
```

Similarly, we'll extract a `DropdownMenu` component to render the list of items:

```tsx
const DropdownMenu = ({
  items,
  onItemClick,
}: {
  items: Item[];
  onItemClick: (item: Item) => void;
}) => {
  return (
    <div className="dropdown-menu">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onItemClick(item)}
          className="item-container"
        >
          <img src={item.icon} alt={item.text} />
          <div className="details">
            <div>{item.text}</div>
            <small>{item.description}</small>
          </div>
        </div>
      ))}
    </div>
  );
};
```

Now, in the `Dropdown` component, we simply use these two components, passing in the corresponding state, turning them into purely controlled components (stateless components).

```tsx
const Dropdown = ({ items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="dropdown">
      <Trigger
        label={selectedItem ? selectedItem.text : "Select an item..."}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && <DropdownMenu items={items} onItemClick={setSelectedItem} />}
    </div>
  );
};
```

In this updated code structure, we've separated concerns by creating specialized components for different parts of the dropdown, making the code more organized and easier to manage.

![List native implementation](images/list-native.png)

## Implementing Keyboard Navigation

Incorporating keyboard navigation within our dropdown list enhances the user experience by providing an alternative to mouse interactions. This is particularly important for accessibility and offers a seamless navigation experience on the web page. Let's explore how we can achieve this using the `onKeyDown` event handler.

Initially, we'll attach a `handleKeyDown` function to the `onKeyDown` event in our `Dropdown` component. Here, we utilize a switch statement to determine the specific key pressed and perform actions accordingly. For instance, when the "Enter" or "Space" key is pressed, the dropdown is toggled. Similarly, the "ArrowDown" and "ArrowUp" keys allow navigation through the list items, cycling back to the start or end of the list when necessary.

```tsx
const Dropdown = ({ items }: DropdownProps) => {
  // ... previous state variables ...

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      // ... case blocks ...
    }
  };

  return (
    <div className="dropdown" onKeyDown={handleKeyDown}>
      {/* ... rest of the JSX ... */}
    </div>
  );
};
```

Additionally, we have updated our `DropdownMenu` component to accept a `selectedIndex` prop. This prop is used to apply a highlighted style and set the `aria-selected` attribute to the currently selected item, enhancing the visual feedback and accessibility.

```jsx
const DropdownMenu = ({
  items,
  selectedIndex,
  onItemClick,
}: {
  items: Item[];
  selectedIndex: number;
  onItemClick: (item: Item) => void;
}) => {
  return (
    <div className="dropdown-menu" role="listbox">
      {/* ... rest of the JSX ... */}
    </div>
  );
};
```

Moving forward, we can encapsulate the state and keyboard event handling logic within a custom hook named `useDropdown`. This hook returns an object containing the necessary states and functions, which can be de-structured and used within our `Dropdown` component, keeping it clean and maintainable.

```jsx
const useDropdown = (items: Item[]) => {
  // ... state variables ...

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ... switch statement ...
  };
  
  const toggleDropdown = () => setIsOpen((isOpen) => !isOpen);

  return {
    isOpen,
    toggleDropdown,
    handleKeyDown,
    selectedItem,
    setSelectedItem,
    selectedIndex,
  };
};
```

Now, our `Dropdown` component is simplified and more readable. It leverages the `useDropdown` hook to manage its state and handle keyboard interactions, demonstrating a clear separation of concerns and making the code easier to understand and manage.

```jsx
const Dropdown = ({ items }: DropdownProps) => {
  const {
    isOpen,
    selectedItem,
    selectedIndex,
    toggleDropdown,
    handleKeyDown,
    setSelectedItem,
  } = useDropdown(items);

  return (
    <div className="dropdown" onKeyDown={handleKeyDown}>
      <Trigger
        onClick={toggleDropdown}
        label={selectedItem ? selectedItem.text : "Select an item..."}
      />
      {isOpen && (
        <DropdownMenu
          items={items}
          onItemClick={setSelectedItem}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};
```

Through these modifications, we have successfully implemented keyboard navigation in our dropdown list, making it more accessible and user-friendly. This example also illustrates how hooks can be utilized to manage complex state and logic in a structured and modular manner, paving the way for further enhancements and feature additions to our UI components.

We can visualise the code a bit better with the React Devtools, note in the *hooks* section, all the states are listed in it:

![Devtools](images/dev-tools.png)

The power of extracting our logic into a hook comes into full play when we need to implement a different UI while maintaining the same underlying functionality. By doing so, we've segregated our state management and interaction logic from the UI rendering, making it a breeze to change the UI without touching the logic.

## Adapting to a New UI Requirement

Consider a scenario where a new design requires using a button as a trigger and displaying avatars alongside the text in the dropdown list. With the logic already encapsulated in our `useDropdown` hook, adapting to this new UI is straightforward.

In the new `DropdownTailwind` component below, we've made use of Tailwind CSS to style our elements. The structure is slightly modified; a button is used as the trigger, and each item in the dropdown list now includes an image. Despite these UI changes, the core functionality remains intact, thanks to our `useDropdown` hook.

```tsx
const DropdownTailwind = ({ items }: DropdownProps) => {
  const {
    isOpen,
    selectedItem,
    selectedIndex,
    toggleDropdown,
    handleKeyDown,
    setSelectedItem,
  } = useDropdown<Item>(items);

  return (
    <div
      className="relative"
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
    >
      <button className="btn p-2 border ..." tabIndex={0}>
        {selectedItem ? selectedItem.text : "Select an item..."}
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu ..."
          role="listbox"
        >
          {(items).map((item, index) => (
            <li
              key={index}
              role="option"
            >
            {/* ... rest of the JSX ... */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

In this rendition, the `DropdownTailwind` component interfaces with the `useDropdown` hook to manage its state and interactions. This design ensures that any UI modifications or enhancements do not necessitate a reimplementation of the underlying logic, significantly easing the adaptation to new design requirements. 

The image below illustrates how the new Tailwind styled dropdown looks, showcasing a different UI while retaining the core dropdown functionality and keyboard interactions.

Through this exercise, we've underscored the importance and efficiency of separating logic from the UI rendering, a practice that significantly boosts code reusability and maintainability, especially when dealing with UI components in a large-scale application.

## Diving Deeper with Additional States

As we advance with our dropdown component, let's explore more intricate states that come into play when dealing with remote data. The scenario of fetching data from a remote source brings forth the necessity to manage a few more states - specifically, we need to handle loading, error, and data states.

![Different status](images/dropdown-async-status.png)

### Unveiling Remote Data Fetching

To load data from a remote server, we will need to define three new states: `loading`, `error`, and `data`. Here's how we can go about it:

```tsx
//...
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Item[] | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Error: ${error.error || response.status}`);
        }

        const data = await response.json();
        setData(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

//...
```

### Refactoring for Elegance and Reusability

Incorporating fetching logic directly within our component can work, but it's not the most elegant or reusable approach. Let’s refactor this by extracting the fetching logic into a separate function:

```tsx
const fetchUsers = async () => {
  const response = await fetch("/api/users");

  if (!response.ok) {
    const error = await response.json();
    throw new Error('Something went wrong');
  }

  return await response.json();
};
```

Now with the `fetchUsers` function in place, we can take a step further by abstracting our fetching logic into a generic hook. This hook will accept a fetch function and will manage the associated loading, error, and data states:

```tsx
const useService = <T>(fetch: () => Promise<T>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const data = await fetch();
        setData(data);
      } catch(e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetch]);

  return {
    loading,
    error,
    data,
  };
}
```

Now, the `useService` hook emerges as a reusable solution for data fetching across our application. It's a neat abstraction that we can employ to fetch various types of data, as demonstrated below:

```tsx
const { loading, error, data } = useService(fetchProducts);
//or 
const { loading, error, data } = useService(fetchTickets);
```

With this refactoring, we've not only simplified our data fetching logic but also made it reusable across different scenarios in our application. This sets a solid foundation as we continue to enhance our dropdown component and delve deeper into more advanced features and optimizations.

## Maintaining Simplicity in the Dropdown Component

Incorporating remote data fetching has not complicated our `Dropdown` component, thanks to the abstracted logic in the `useService` and `useDropdown` hooks. Our component code remains in its simplest form, effectively managing the fetching states and rendering the content based on the data received.

```tsx
const Dropdown = () => {
  const { data, loading, error } = useService(fetchUsers);

  const {
    toggleDropdown,
    dropdownRef,
    isOpen,
    selectedItem,
    selectedIndex,
    updateSelectedItem,
    getAriaAttributes,
  } = useDropdown<Item>(data || []);

  const renderContent = () => {
    if (loading) return <Loading />;
    if (error) return <Error />;
    if (data) {
      return (
        <DropdownMenu
          items={data}
          updateSelectedItem={updateSelectedItem}
          selectedIndex={selectedIndex}
        />
      );
    }
    return null;
  };

  return (
    <div
      className="dropdown"
      ref={dropdownRef as RefObject<HTMLDivElement>}
      {...getAriaAttributes()}
    >
      <Trigger
        onClick={toggleDropdown}
        text={selectedItem ? selectedItem.text : "Select an item..."}
      />
      {isOpen && renderContent()}
    </div>
  );
};
```

In this updated `Dropdown` component, we utilize the `useService` hook to manage the data fetching states, and the `useDropdown` hook to manage the dropdown-specific states and interactions. The `renderContent` function elegantly handles the rendering logic based on the fetching states, ensuring that the correct content is displayed whether it's loading, an error, or the data. 

Through the separation of concerns and the use of hooks, our `Dropdown` component remains clean and straightforward, showcasing the power of composable logic in React.

## Introducing Headless Component Pattern

The headless component pattern unveils a robust avenue for cleanly segregating our JSX code from the underlying logic. While composing declarative UI with JSX comes naturally, the real challenge burgeons in managing state. This is where headless components come into play by shouldering all the state management intricacies, propelling us towards a new horizon of abstraction.

In essence, a headless component is a function or object that encapsulates logic, but doesn’t render anything itself. It leaves the rendering part to the consumer, thus offering a high degree of flexibility in how the UI is rendered. This pattern can be exceedingly useful when we have complex logic that we want to reuse across different visual representations.

```jsx
function useDropdownLogic() {
  // ... all the dropdown logic
  return {
    // ... exposed logic
  };
}

function MyDropdown() {
  const dropdownLogic = useDropdownLogic();
  return (
    // ... render the UI using the logic from dropdownLogic
  );
}
```

When visualized, the headless component appears as a slender layer interfacing with JSX views on one side, and communicating with underlying data models on the other (for a deeper dive about domain modelling, refer to [article](https://martinfowler.com/articles/modularizing-react-apps.html)). This pattern is particularly beneficial for individuals seeking solely the behavior or state management aspect of the UI, as it conveniently segregates these from the visual representation.

![The headless component pattern](images/headless-component.png)

### Advantages of headless component:

1. **Reusability**: The logic encapsulated in headless components can be reused across multiple components. This fosters DRY (Don’t Repeat Yourself) principles in your codebase.
2. **Separation of Concerns**: By decoupling logic from rendering, headless components promote a clear separation of concerns which is a cornerstone of maintainable code.
3. **Flexibility**: They allow for varying UI implementations while sharing the same core logic, making it easier to adapt to different design requirements or frameworks.

### Drawbacks of headless component:

1. **Learning Curve**: The pattern may introduce a learning curve for developers unfamiliar with it, potentially slowing down development initially.
2. **Over-abstraction**: If not managed judiciously, the abstraction created by headless components can lead to a level of indirection that might make the code harder to follow.

### Libraries and Further Exploration:

The headless component pattern has been embraced by various libraries to facilitate the creation of accessible, customizable, and reusable components. Here are some notable libraries along with a brief description of each:

- **[React ARIA](https://react-spectrum.adobe.com/react-aria/)**: A library from Adobe that provides accessibility primitives and hooks for building inclusive React applications. It offers a collection of hooks to manage keyboard interactions, focus management, and ARIA annotations, making it easier to create accessible UI components.

- **[Headless UI](https://headlessui.dev/)**: A completely unstyled, fully accessible UI component library, designed to integrate beautifully with Tailwind CSS. It provides the behavior and accessibility foundation upon which you can build your own styled components.

- **[React Table](https://react-table.tanstack.com/)**: A headless utility for building fast and extendable tables and datagrids for React. It provides a flexible hook that allows you to create complex tables with ease, leaving the UI representation up to you.

- **[Downshift](https://www.downshift-js.com/)**: A minimalist library to help you create accessible and customizable dropdowns, comboboxes, and more. It handles all the logic while letting you define the rendering aspect.


These libraries embody the essence of the headless component pattern by encapsulating complex logic and behaviors, making it straightforward to create highly interactive and accessible UI components. While the provided example serves as a learning stepping stone, it's prudent to leverage these production-ready libraries for building robust, accessible, and customizable components in a real-world scenario.

This pattern not only educates us on managing complex logic and state but also nudges us to explore production-ready libraries that have honed the headless component approach to deliver robust, accessible, and customizable components for real-world use.

## Summary

In this article, we delved into the world of Higher-Order Components (HOCs) and Hooks in React, exploring their utility in enhancing component logic while maintaining a clean, readable codebase. Through the lens of creating an expandable panel and a dropdown list, we illustrated the composability of HOCs and the encapsulation of stateful logic that Hooks offer. Transitioning to a more intricate dropdown list, we introduced asynchronous data fetching, demonstrating how Hooks can simplify state management in data loading scenarios.

We then transitioned into the realm of headless components, a powerful pattern that separates logic from the JSX code, providing a robust framework for managing state while leaving the UI representation to the developer. Through examples, we demonstrated how this separation facilitates the creation of reusable, accessible, and customizable components. The discussion was enriched with a review of notable libraries like React Table, Downshift, React UseGesture, React ARIA, and Headless UI that embody the headless component pattern, providing ready-to-use solutions for building interactive and accessible UI components.

This exploration underscores the importance of understanding and leveraging these patterns and libraries to build scalable, accessible, and maintainable React applications.