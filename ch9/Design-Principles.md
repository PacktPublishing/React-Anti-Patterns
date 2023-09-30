# Applying Design principles in React

Design principles are like the cardinal rules that guide software development, ensuring that code remains maintainable, scalable, and readable over time. In the ever-changing landscape of technology, adhering to these principles can be the difference between a project's long-term success and its descent into "code hell," where changes become increasingly arduous and bugs frequent.

For React applications, the importance of design principles escalates due to the library's declarative nature and component-based architecture. React empowers developers to build complex UIs from small, isolated pieces of code known as components. While this modular approach is one of React’s strongest features, it can also lead to a messy and unmanageable codebase if design principles are ignored.

In a typical React project, components often share state and behavior, get nested within each other, and are reused across different parts of an application. Without following design principles, you might find yourself entangled in a web of dependencies, making it difficult to change or even understand the code. For instance, neglecting the Single Responsibility Principle could result in components that are difficult to test and refactor, while ignoring Interface Segregation could make your components less reusable and more coupled to specific use-cases.

Furthermore, as React continues to evolve, with new features like hooks and concurrent mode, having a design principle-centered approach ensures that you can adapt to these changes without significant rewrites. This allows you to focus on building features, fixing bugs, and delivering value, instead of grappling with technical debt.

Adhering to design principles in React development is not just a best practice but a necessity. It serves as a proactive measure to counteract complexity, making your React code easier to read, test, and maintain.

In this chapter, we will cover the following topics:

- Revisiting Single Responsibility Principle
- Embracing Dependency Inversion Principle
- Understainding CQRS in React

In this chapter, we commence by revisiting the Single Responsibility Principle, a core concept that often serves as the bedrock of clean, maintainable code. From the humble beginnings of a simple string transforming function, we'll explore how this principle scales up to the complexities of render props, enriching the structure and readability of your React components.

Transitioning from there, we introduce the 'Dependency Inversion Principle', a transformative approach to component design. This section emphasizes that focusing on the interface—not the nitty-gritty details of implementation—is the pathway to reusable and easily understandable components.

Concluding the chapter, we delve into Command Query Responsibility Segregation (CQRS), a pattern that gains importance as your React applications grow in size and complexity. Through a discussion on CQRS, you'll discover strategies to separate your application's command and query responsibilities, thereby making it more manageable and scalable.

This chapter aims to equip you with a holistic understanding of key design principles, which in turn will lay a strong foundation for the rest of your journey in mastering React.

# Technical requirements

A GitHub repository has been created to host all the code we discuss in the book. For this chapter, you can find the recommended structure under https://github.com/PacktPublishing/React-Anti-Patterns/tree/main/ch9.

# Revisiting Single Responsibility Principle

In Chapter 4, we delved into the Single Responsibility Principle within the context of designing React components. Yet, this principle is more universal, acting as the bedrock for various other programming tenets. To bring this idea to life, let's work through some hands-on examples.

## The evolution of Title 

Let's start simple with a basic function component called `Title`.

```ts
const Title = () => <div>Title ｜ This is a title</div>
```

As it stands, this component merely outputs a static string. To give it the ability to render different titles, we introduce a `title` prop.

```ts
const Title = ({ title }: { title: string }) => <div>Title ｜ {title}</div>;
```

With this change, the component becomes more versatile, appending a fixed prefix 'Title |' to any title we pass in. But what if we want to further manipulate the title, perhaps to capitalize it?

Note: Higher-Order Function
In many programming languages (include JavaScript), a higher-order function is one that either takes another function as an argument or returns a function, or both. These functions are foundational in functional programming, enabling you to write modular and reusable code. They are commonly used for operations like map, filter, and reduce on arrays, function composition, currying, and event handling. Higher-order functions simplify code structure, improve maintainability, and allow for more advanced programming techniques.


Utilizing higher-order function, we can modify our `Title` component as follows:

```ts
const Title = ({
  title,
  transformer,
}: {
  title: string;
  transformer: (s: string) => string;
}) => <div>Title ｜ {transformer(title)}</div>;
```

Great, our title is now fully customizable. But let's stretch this even further. What if we want the title to be inside an `h3` tag rather than a simple `div`? React has got us covered; we can pass a function that returns JSX elements.

```ts
const Title = ({
  title,
  render,
}: {
  title: string;
  render: (s: string) => React.ReactNode;
}) => <div>{render(title)}</div>;
```

Notice the use of the `render` prop. It's invoked within curly brackets and can be implemented like this:

```ts
<Title
  title="This is a title"
  render={(s: string) => {
    const formatted = s.toUpperCase();
    return <h3>{formatted}</h3>;
  }}
/>
```

In React, this higher-order function doesn't necessarily have to be named `render`. We could just as easily use the `children` prop for a more intuitive design:

```ts
const Title = ({
  title,
  children,
}: {
  title: string;
  children: (s: string) => React.ReactNode;
}) => <div>{children(title)}</div>;
```

This allows us to invoke `children` as if it were a regular function:

```ts
<Title title="This is a title">
  {(s: string) => {
    const formatted = s.toUpperCase();
    return <h3>{formatted}</h3>;
  }}
</Title>
```


Note: Render Props Pattern
In React, the render props pattern involves passing a function as a prop to a component. This function returns JSX that the component will render as part of its output. The pattern allows for more flexible and reusable components by giving the parent component control over a part of the child component's rendering logic. It's particularly useful for sharing behavior across multiple components.


Take note of the overarching pattern at play here: abstraction. Initially, we might think of `h2` or `h3` as specific instances of headings. However, upon zooming out a bit, we realize that they're part of a broader abstraction: a React component, or more technically, a `ReactNode`.

This realization allows us to see the utility of using render props or `children` as higher-order functions. They're not just features; they represent the level of abstraction we've achieved. Now, instead of being limited to a specific HTML tag like `h3`, we can pass any JSX element as an argument, from headings to fully styled components.

With our newly crafted generic component that uses a render prop, we've essentially created a reusable framework. The beauty lies in the fact that we only need to write this general-purpose code once. 

## Identifing the core functionality

Identifying the core responsibility of a component is key to adhering to the Single Responsibility Principle. Once you isolate what the component is fundamentally meant to do, it becomes easier to refactor and abstract out the auxiliary functionalities. 

Render props and composition are excellent techniques for this. They allow you to extend or customize the behavior of a component without altering its core logic. This keeps your components clean, modular, and easy to test, as each component does one thing and does it well. We have already see how render props works in the evolution of Title above, let's now have a look at the composition.

## Break down the Avatar component

Assume we have an Avatar component in a Design System, it has a handy feature: if a user passed in name prop to the component, then when the mouse hovering over the avatar, a tooltip will show up at the bottom of the avatar with the name as its content.

![Avatar component with Tooltip](ch9/avatar.png)

And internally, Avatar is utilising another component Tooltip to make it happen:

```tsx
import Tooltip from "@xui/tooltip";

type AvatarProps = {
  name?: string;
  url: string;
};

const Avatar = ({ name, url }: AvatarProps) => {
  if (name) {
    return (
      <Tooltip content={name}>
        <div className="rounded">
          <img src={url} alt={name} />
        </div>
      </Tooltip>
    );
  }
  return (
    <div className="rounded">
      <img src={url} alt="" />
    </div>
  );
};
```

The `Avatar` component takes two optional props: `name` and `url`. It displays an image using the URL provided. If the `name` prop is also provided, it wraps the image in a `Tooltip` component that shows the name when hovered over. The div is styled with a "rounded" class which will make the avatar in a circle.

The original code for the Avatar component tightly coupled it with a Tooltip feature. As users demanded more customization options for the tooltip, maintaining this coupling became challenging. Adding more props to handle tooltip customization can bloat the Avatar component and create a ripple effect: any change in Tooltip may necessitate changes in Avatar, making it hard to manage.

Instead of forcing Tooltip into Avatar, we simplified Avatar to focus solely on its primary function—displaying an image. This stripped-down version excludes the tooltip, reducing its bundle size and making it more maintainable. Here's how the simplified Avatar component looks:

```tsx
const Avatar = ({ name = "", url }: AvatarProps) => (
  <div className="rounded">
    <img src={url} alt={name} title={name} />
  </div>
);
```

By doing so, we make the Avatar and Tooltip components composable, meaning they can work independently of each other. The consumer can then choose to wrap Avatar with Tooltip if desired, as shown in the code snippet below:

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

The benefit of this approach is twofold:

1. The Avatar component remains lean, reducing its bundle size.
2. The consumer has the freedom to customize Tooltip or even use different tooltip libraries without affecting Avatar.

In short, the separation makes the code more modular, and users only have to "pay" in terms of code and complexity for the features they actually use.

In both the render props and composition examples, we underlined the essence of the Single Responsibility Principle (SRP) in modern web development. SRP advocates for building components that do one thing and do it well, making them more maintainable, reusable, and flexible.

Next, let's pivot to discussing the "Interface Mindset," another crucial perspective that complements these design principles.

# Embracing Dependency Inversion Principle

The Dependency Inversion Principle (DIP) is one of the five principles that make up the SOLID acronym, a set of guidelines aimed at helping developers create more maintainable, flexible, and scalable software. Specifically, DIP encourages developers to depend on abstractions, not on concrete implementations. 

The Dependency Inversion Principle addresses several challenges that developers face when building and maintaining large systems. One such problem is the rigidity that comes from tightly coupled modules. When high-level modules are dependent on low-level modules, even small changes to the low-level code can have a broad impact, necessitating changes across the system. 

By saying high-level module and low-level details, think of a notification feature in a system. We would like to send out a notification in a form the user perfer: either an email, a sms message or both.

```tsx
class EmailNotification {
  send(message: string, type: string) {
    console.log(`Sending email with message: ${message}, type: ${type}`);
  }
}

class Application {
  private emailNotification: EmailNotification;

  constructor(emailNotification: EmailNotification) {
    this.emailNotification = emailNotification;
  }

  process() {
    // perform some actions to response user interaction
    this.emailNotification.send("Some events happened", "info");
  }
}

const app = new Application(new EmailNotification());
app.process();
```

In the code above, the `EmailNotification` class has a method called `send` that takes a message and a type as parameters. It then prints out a log to indicate that an email with this message and type is being sent. The `Application` class, on the other hand, has a `process` method that simulates some kind of user interaction. Inside this method, `Application` uses an instance of `EmailNotification` to send an email whenever `process` is invoked.

One important thing to note here is that `Application` is tightly coupled to `EmailNotification`. This means that if you wanted to change how notifications are sent, perhaps by using SMS instead of email, you'd have to modify the `Application` class directly, thereby violating the Single Responsibility Principle and making the system less flexible.

So to resovle the problem, we can introduce a interface `Notification`, and let `EmailNotification` to implement the interface. And instead of depends on `EmailNotification` class, the `Application` depends on the `Notification` interface. And then we could easily swap it to a `SMSNotification` if we like.

```tsx
interface Notification {
  send(message: string, type: string): void;
}

class EmailNotification implements Notification {
  send(message: string, type: string) {
    console.log(`Sending email with message: ${message}, type: ${type}`);
  }
}

class Application {
  private notifier: Notification;

  constructor(notifier: Notification) {
    this.notifier = notifier;
  }

  process() {
    // perform some actions to response user interaction
    this.notifier.send("Some event happened", "info");
  }
}
```

The code defines a `Notification` interface with a `send` method, which is then implemented by the `EmailNotification` class. The `Application` class is now constructed with any object that adheres to the `Notification` interface. Within its `process` method, `Application` uses this object to send a notification. This setup decouples the `Application` class from the specific notification mechanism, making it more flexible and easier to change or extend.

For instance, if we decide to replace `EmailNotification` with `SMSNotification`, the `Application` class won't need any modifications; we would simply provide a different instance that implements the `Notification` interface.

```tsx
const app = new Application(new EmailNotification());
app.process();

// or
const app = new Application(new SMSNotification());
app.process();
```

All right, that's briefly about how the Dependency Inversion Principle (DIP) works, let's look at another example to find out how to apply the same principle inside React applcation.

## Analytics button

Imagine you have a generic button component that's used across various parts of your application. You want to send analytics events when the button is clicked, but how exactly those events are sent should be abstracted away from the button component itself.

But the problem is that the generic button is widely used in many products already, and not all of them need the analytics functionality. So if you simply change the `onClick` handler in the shared Button component, it would annoy many innocent users.

```tsx
const Button = ({ onClick: provided, name, ...rest }: ButtonProps) => {
  const onClick = (e) => {
    // emit an event to the analytic server
    return provided(e);
  };

  return <button onClick={onClick} {...rest} />;
};
```

We could instead, define a new component wraps the original button around and hijack the click handler for the analysis:

```tsx
import { Button } from "@xui/button";

const FancyButton = ({
  onClick: originalOnClick,
  ...rest
}: FancyButtonProps) => {
  const onClick = (e) => {
    //emit an event to the analytic server
    console.log('sending analytics event to a remote server');
    return originalOnClick(e);
  };

  return <Button onClick={onClick} {...rest} />;
};
```

The code defines a `FancyButton` component that wraps around a basic `Button` component. When clicked, `FancyButton` first sends an analytics event to a remote server, and then proceeds to execute the original `onClick` function passed to it. All other props are passed down directly to the underlying `Button`.

The issue here is that many instances where the `Button` is used might contain similar analytics code, leading to repetitive logic across the codebase. This redundancy is undesirable, as any changes to the analytics logic would require updates in multiple locations, increasing the risk of errors.

Then let's consider the new learnt principle: Dependency Inversion Principle. We will make some changes in the original Button, but instead of send analytics events directly, we'll firstly extract an interface and rely on the interface. One of the implementation will do the actual events sending work. For products that using button but don't use analytics at all, they just pass in a empty implementation. 

To make the change, we'll need to define new interface type, and also we need a context for the implemention of the interface to live in.

```tsx
import { createContext } from "react";

export interface InteractionMeasurement {
  measure(name: string | undefined, timestamp?: number): void;
}

export default createContext<InteractionMeasurement | null>(null);
```

It creates a React context named `InteractionMeasurement` with an interface that specifies a `measure` method. This method takes a name (either a string or undefined) and an optional timestamp. And the context is initialized as `null`.

And inside the Button, we can use `useContext` to access the context we defined.

```tsx
import InteractionContext, {
  InteractionMeasurement
} from "./InteractionContext";

const Button = ({ name, onClick: providedOnClick, children }: ButtonType) => {
  const interactionContext = useContext<InteractionMeasurement | null>(
    InteractionContext
  );

  const handleClick = useCallback(
    (e) => {
      interactionContext &&
      interactionContext.measure(name, e.timeStamp);
      providedOnClick(e);
    },
    [providedOnClick, interactionContext, name]
  );

  return <button onClick={handleClick}>{children}</button>;
};
```

The code defines a Button component that uses the `InteractionContext` to track clicks. When the button is clicked, it calls the `measure` method from the context, passing in the button's name and the click event's timestamp. Then it proceeds to execute any additional onClick logic provided. This way, click tracking is abstracted away into the context, making the Button component more reusable and maintainable.

If the `interactionContext` is null, the `measure` function won't be called, and the component will proceed to execute only the `providedOnClick` function passed in as a prop. This allows for optional analytics tracking based on the availability of the `InteractionContext`.

That would perfectly resovle the problem we have - if product want to enable the analytics, they can use Button with a context contains a `InteractionMeasurement` implementation.

```tsx
import InteractionContext from "./InteractionContext";
import { Button } from "@xui/button";

const FormApp = () => {
  const context = {
    measure: (e, t) => {
      //send event and timestamp to remote
      console.log(`sending to remote server  ${e}: ${t}`);
    },
  };

  const onClick = () => {
    console.log("submit");
  };

  return (
    <InteractionContext.Provider value={context}>
      <form>
        <Button name="submit-button" onClick={onClick}>
          Submit
        </Button>
      </form>
    </InteractionContext.Provider>
  );
};
```

The `FormApp` component defines its own analytics logic in `measure` function inside `context` object. It then passes this function to child components through the `InteractionContext.Provider`. When a `Button` inside the form is clicked, not only will the button's specific `onClick` logic be executed, but the `measure` function will also send event and timestamp data to a remote server for analytics. This setup allows for context-based analytics without tying the `Button` component to a specific implementation.

And for users who don't want the analytics functionality, they just use the `Button` as usual:

```tsx
import { Button } from "@xui/button";

const App = () => {
  const onClick = () => {
    console.log("checkout");
  };

  return (
    <Button name="checkout-button" onClick={onClick}>
      Checkout
    </Button>
  );
};
```

This methodology offers exceptional flexibility and dynamism, making it invaluable for designing common components. It enhances both code reusability and system maintainability while also reducing the overall bundle size.

Having that said, I woulld like to introduce another design principle I constantly use in my code, you can think of it as a special form of Single Responsibility Principle at it's core.  This principle is the Separation of Command and Query Principle, or CQRS in short.

# Understainding CQRS in React

The Separation of Command and Query Principle is a software design principle that suggests that methods or functions should either be commands that modify the system's state or queries that return information about the system's state, but not both.

Commands (or Modifiers) are methods that perform an action or change the state of an object without returning a value. Queries, on the other hand, are methods to read an object's state without any changes. Separating commands and queries can help reduce coupling between components, making testing, maintaining, and modifying code easier. It also makes it easier to reason about the behaviour of code and can improve the overall design of a system.

Although this pattern widely used in large scale like designing architecuture of systems, it works well in code level as well. I will demonstrate this in a ShoppingCart component, as that probably something you've already familiar with.

```tsx
type Item = {
  id: string;
  name: string;
  price: number;
}

const ShoppingApplication = () => {
  const [cart, setCart] = useState<Item[]>([]);

  const addItemToCart = (item: Item) => {
    setCart([...cart, item]);
  };

  const removeItemFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div>
      <ProductList addToCart={addItemToCart} />

      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - {item.price}
            <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total Price: {totalPrice}</p>
    </div>
  );
};
```

The `ShoppingApplication` component maintains a shopping cart using the `useState` hook with an array of items of type `Item`. The `addItemToCart` function adds new items to the cart, and `removeItemFromCart` removes items based on their id. The `totalPrice` is calculated as the sum of all item prices in the cart. 

The component renders a list of items in the cart, along with their total price. Each item has a "Remove" button that calls `removeItemFromCart` when clicked. A `ProductList` component is also rendered, and it receives `addItemToCart` as a prop for adding products to the cart.

The above code appears to be okay at first glance, but it contains some subtle issues. One problem is that when multiple identical products are added to the cart, the keys will overlap, triggering React's warning about unique keys. Additionally, if you click the "Remove" button in this situation, it will delete all instances of that product from the cart, which is far from ideal and leads to a poor user experience.

To fix the issue, we need to introduce a `uniqKey` to product type (by adding a optional field `uniqKey` in the type `Item`), and we need to generate it before an item is inserted into `cart` array, and also need to remove item by `uniqKey` instead of by `id`:

```tsx
const addItemToCart = (item: Item) => {
  setCart([...cart, { ...item, uniqKey: `${item.id}-${Date.now()}` }]);
};

const removeItemFromCart = (key: string) => {
  setCart(cart.filter((item) => item.uniqKey !== key));
};
```

And we also need to update how the `cart`s is rendered in TSX:

```tsx
<h2>Shopping Cart</h2>
<ul>
  {cart.map((item) => (
    <li key={item.uniqKey}>
      {item.name} - {item.price}
      <button onClick={() => removeItemFromCart(item.uniqKey)}>
        Remove
      </button>
    </li>
  ))}
</ul>
```

While the code is technically sound and sufficiently straightforward for its current scope, as we expand the `ShoppingApplication` component with more states and calculations, applying the CQRS principle could provide a structured way to keep everything organized.

## Implementing CQRS with context and useReducer

Firstly, let's introduce a new hook `useReducer`. The `useReducer` hook in React is used for state management in functional components. It is particularly useful when the next state depends on the previous one or when you have complex state logic. The `useReducer` hook takes two arguments: a reducer function and an initial state. It returns the current state and a dispatch method to trigger updates.

A reducer function receives the current state and an action object, which contains information on how to update the state. The function should return the new state based on the action type and payload.

Let's define a reducer function for our `ShoppingApplication`:

```tsx
type ShoppingCartState = {
  items: Item[];
  totalPrice: number;
};

type ActionType = {
  type: string;
  payload: Item;
};

const shoppingCartReducer = (
  state: ShoppingCartState = initState,
  action: ActionType
) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const item = {
        ...action.payload,
        uniqKey: `${action.payload.id}-${Date.now()}`,
      };
      return { ...state, items: [...state.items, item] };
    }

    case "REMOVE_ITEM":
      const newItems = state.items.filter(
        (item) => item.uniqKey !== action.payload.uniqKey
      );
      return { ...state, items: newItems };
    default:
      return state;
  }
};
```

The shopping cart reducer is a function that takes two arguments: the current state and an action. The state is of type `ShoppingCartState`, which includes an array of `items` and a `totalPrice`. The action is of type `ActionType`, which includes a `type` string to identify the action and a `payload` containing an `Item` object.

Inside the reducer, a `switch` statement is used to determine what action is being dispatched. The "ADD_ITEM" case adds a new item to the state's `items` array. This item is given a unique key, `uniqKey`, to differentiate it from identical items. The "REMOVE_ITEM" case removes an item from the `items` array based on this unique key.

By using this structure, the reducer provides a predictable way to manage the shopping cart's state in response to different actions. Note there is nothing fancy here in this reducer function, we could test the reducer with the following code:

```tsx

const item = {
  id: "p1",
  name: "iPad",
  price: 666,
};

let x = shoppingCartReducer(initState, {
  type: "ADD_ITEM",
  payload: item,
});

console.log(x);
```

And we would get something like (obviously your uniqKey would be different from mine as it's generated by the time an item is added):

```tsx
{
    "items": [
        {
            "id": "p1",
            "name": "iPad",
            "price": 666,
            "uniqKey": "p1-1696059737801"
        }
    ],
    "totalPrice": 0
}
```

## Using the reducer function

Let's see how we can use reducer function to implement the CQRS to simplify our code. Firstly we'll need a context to manage the cart state, and also expose query functions for components to use:

```tsx
import React, { createContext, useContext, useReducer } from "react";
import { Item } from "./type";

type ShoppingCartContextType = {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (item: Item) => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType | null>(null);

export const ShoppingCartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(shoppingCartReducer, {
    items: [],
    totalPrice: 0,
  });

  const addItem = (item: Item) => {
    dispatch({type: ADD_ITEM, payload: item});
  };

  const removeItem = (item: Item) => {
    dispatch({type: REMOVE_ITEM, payload: item});
  };

  return (
    <ShoppingCartContext.Provider value={{items: state.items, addItem, removeItem}}>
      {children}
    </ShoppingCartContext.Provider>
  );
};
```

The code creates a React context for managing a shopping cart. Inside `ShoppingCartProvider`, it uses the `useReducer` hook to handle cart actions. Two functions, `addItem` and `removeItem`, dispatch actions to modify the cart. The provider component makes the cart state and these functions available to its child components via the `ShoppingCartContext`. This allows any nested components to interact with the shopping cart.

Note `addItem` and `removeItem` are two command functions in CQRS principle, which only change the state without returning any data. If we want to get the data, we can define a query function.

```tsx
export const useTotalPrice = () => {
  const context = useContext<ShoppingCartContextType>(
    ShoppingCartContext
  );

  const {items} = context;

  return items.reduce((acc, item) => acc + item.price, 0);
};
```

Here we define a custom hook called `useTotalPrice` that calculates the total price of items in a shopping cart. It uses the React `useContext` hook to access the shopping cart data from `ShoppingCartContext`. It then uses `reduce` method to sum up the prices of all the items in the cart, starting with an initial value of 0.

And for the `ShoppingApplication` component, we can simply wrap the `ProductList` and `ShoppingCart` inside the `ShoppingCartContext` we just created:

```tsx
const ShoppingApplication = () => {
  const context = useContext(ShoppingCartContext);
  const { items, addItem, removeItem } = context;
  const totalPrice = useTotalPrice();

  return (
    <div>
      <ProductList addToCart={addItem} />

      <h2>Shopping Cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.uniqKey}>
            {item.name} - {item.price}
            <button onClick={() => removeItem(item)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total Price: {totalPrice}</p>
    </div>
  );
};
```

The `ShoppingApplication` component serves as the main interface for the shopping application. It uses React's `useContext` to access the shopping cart context, which provides the list of items in the cart (`items`), a function to add items (`addItem`), and a function to remove items (`removeItem`). The component also uses a custom hook `useTotalPrice` to calculate the total price of items in the cart.

And in the outmost `App` component, we can wrap the `ShoppingApplicaion` inside:

```tsx
<ShoppingCartProvider>
  <ShoppingApplication />
</ShoppingCartProvider>
```

Command Query Responsibility Segregation (CQRS) is a design pattern that separates the modification and query aspects of a system to enhance scalability, maintainability, and simplicity. We demonstrated this principle by implementing a shopping cart feature. Commands to modify the cart's state, like adding or removing items, were segregated from the queries, which included fetching the list of items and calculating the total price. This separation was made clear through the use of React's context API and custom hooks, which isolated each responsibility effectively. This not only improves code readability but also makes it easier to manage and scale the application in the future.

# Summary

In this chapter, we've unpacked three crucial design principles: Single Responsibility for focused, easy-to-understand components; Dependency Inversion for modular, testable code; and CQRS for a distinct separation between commands and queries, enhancing maintainability. These principles offer a robust foundation for building scalable and high-quality software. 

In the next chapter, we'll dive deeper into composition principles to further refine our approach to React application design.
