---

**Common React Anti-Patterns in Component Design**

1. **Mutating State Directly**: In React, you should never mutate state directly. Always use `setState` or the `set` function from `useState` hook to update state variables. 

    For example, `this.state.count = 1; // Wrong`

2. **Overusing Refs**: Refs are used for interacting with DOM nodes directly but should be used sparingly. Overusing refs can lead to a messy codebase which is hard to manage and reason about.

    For example, using refs to manage form values instead of controlled components is generally an anti-pattern.

3. **Ignoring the Component’s Key**: The `key` prop is necessary while rendering lists in React. It helps React identify which items have changed, are added, or removed. 

    For example, when rendering a list of `Todo` components, each `Todo` should have a unique key.

4. **Inline Function Definition**: Defining functions inline in the JSX can have performance implications as it can cause unnecessary re-renders. 

    For example, `<button onClick={() => console.log('Clicked')}>Click me</button> // Not recommended`

5. **Props Drilling**: Passing props down multiple layers of components is not recommended as it makes the code less readable and harder to maintain. 

    For example, if a parent component passes a prop through several layers of children just so it can be used in a deeply nested component, that's props drilling.

**Avoiding Anti-Patterns**

1. Always use `setState` or the `set` function from `useState` to update state.

    Correct example: `this.setState({ count: 1 }); // Class components` or `setCount(1); // Functional components with useState`

2. Use refs sparingly and only when necessary

. Consider other React features for state management.

    For example, to collect input values, prefer controlled components over uncontrolled components with refs.

3. Always provide a unique `key` prop when rendering a list of elements.

    Correct example: `{todos.map((todo) => <Todo key={todo.id} {...todo} />)}`

4. Define functions outside the JSX or use `useCallback` hook to memoize them.

    Correct example: `const handleClick = () => console.log('Clicked'); // Define outside JSX`

5. Use Context API or state management libraries like Redux or MobX to avoid props drilling.

    For example, if multiple components need access to a user object, consider providing the user object via Context instead of passing it through props.

---

---

Let's refactor this using context, hooks and composition.

First, let's define a `PageContext` which will hold all our shared state:

```tsx
type PageContextType = {
    headerTitle: string;
    headerSubtitle: string;
    sidebarLinks: string[];
    onHeaderClick: () => void;
    onSidebarLinkClick: (link: string) => void;
};

const PageContext = React.createContext<PageContextType | undefined>(undefined);
```

The `PageContextType` is a type that includes properties such as `headerTitle`, `headerSubtitle`, `sidebarLinks`, `onHeaderClick`, and `onSidebarLinkClick`.  `React.createContext` is used to initialize the context, and it's given an initial value of `undefined`. The generic type parameter `<PageContextType | undefined>` is used to specify that the context value could either be of type `PageContextType` or `undefined`. 

Next, we define a `PageProvider` component that will provide this context to any children:

```tsx
type PageProviderProps = {
    config: PageContextType;
    children: React.ReactNode;
};

function PageProvider({ config, children }: PageProviderProps) {
    return (
        <PageContext.Provider value={config}>
            {children}
        </PageContext.Provider>
    );
}
```

The `PageProvider` component takes in `PageProviderProps` as props that includes two properties: `config` and `children`. 

- `config`: This property is of type `PageContextType` and is intended to be the value provided to all components within this context.
- `children`: This property is of type `React.ReactNode` and represents the child components that `PageProvider` will wrap and provide context to.

Now, we can split our `Page` component into several smaller components:

```tsx
function Header() {
    const context = React.useContext(PageContext);
    if (!context) throw new Error("Header must be used within a PageProvider");

    return (
        <header onClick={context.onHeaderClick}>
            <h1>{context.headerTitle}</h1>
            <h2>{context.headerSubtitle}</h2>
        </header>
    );
}

function Sidebar() {
    const context = React.useContext(PageContext);
    if (!context) throw new Error("Sidebar must be used within a PageProvider");

    return (
        <aside>
            <ul>
                {context.sidebarLinks.map((link) => (
                    <li key={link} onClick={() => context.onSidebarLinkClick(link)}>
                        {link}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

function Main({ children }: { children: React.ReactNode }) {
    return <main>{children}</main>;
}

function Page({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            <Sidebar />
            <Main>{children}</Main>
        </div>
    );
}
```

Now, using our components might look like this:

```tsx
<PageProvider
    config={{
        headerTitle: "My Page",
        headerSubtitle: "Welcome",
        sidebarLinks: ["Home", "About", "Contact"],
        onHeaderClick: () => console.log("Header clicked"),
        onSidebarLinkClick: (link) => console.log(`${link} clicked`),
    }}
>
    <Page>
        <h1>Welcome to my page!</h1>
    </Page>
</PageProvider>
```

By doing this, we split a large component into smaller, more manageable ones. We're using context to share state and functionality across components, which reduces the amount of prop drilling.

# Summary

https://dev.to/codeofrelevancy/what-is-prop-drilling-in-react-3kol

**Props Drilling**

Props drilling is a common anti-pattern in React where props are passed from a parent component down through several layers of children to reach the components that actually need them. This happens when the state is managed in the top-level component and various children at different levels need to use that state or modify it.

**The Problem**

The main problem with props drilling is that it makes the code harder to understand and maintain. As your application grows, it can become difficult to keep track of where the props are coming from and which components are using them.

In addition, it makes your components less reusable, as they need to be given the same props each time they are used. And if you need to add or remove a prop, you need to do it at every level of the component hierarchy, which can lead to bugs.

**Example**

Here's an example of props drilling:

```jsx
import React from 'react';

interface UserProps {
    name: string;
}

const User: React.FC<UserProps> = ({ name }) => {
    return <p>{name}</p>;
};

const UserProfile: React.FC<UserProps> = ({ name }) => {
    return <User name={name} />;
};

const App: React.FC<UserProps> = ({ name }) => {
    return <UserProfile name={name} />;
};
```

In this example, the `name` prop is being drilled down from the `App` component to the `User` component via the `UserProfile` component, which doesn't use the prop itself.

**Solutions**

There are several ways to avoid props drilling:

1. **Context API**: The Context API allows you to share values between components without having to explicitly pass a prop through every level of the tree. With Context API, you can avoid props drilling by wrapping the parent component with a Provider and then using a Consumer in any child component that needs the value.

    ```jsx
    import React, { useContext } from 'react';

    const UserContext = React.createContext('');

    const User: React.FC = () => {
        const name = useContext(UserContext);
        return <p>{name}</p>;
    };

    const UserProfile: React.FC = () => {
        return <User />;
    };

    const App: React.FC<UserProps> = ({ name }) => {
        return (
            <UserContext.Provider value={name}>
                <UserProfile />
            </UserContext.Provider>
        );
    };
    ```
   
2. **Redux or other state management libraries**: These libraries help manage global state and avoid prop drilling by allowing any component to access the state it needs from a central store.

3. **Composition**: If you're passing a lot of props through a component just so it can give them to a child, it might make more sense to let the parent render the child directly.

Remember, while props drilling can be a symptom of a larger problem, passing props from a parent to a direct child is perfectly fine and is a standard part of how components are designed to work in React. The issue arises when props need to be passed through several levels, especially through components that don't use the props.

---

In React, form data such as `<input>`, `<textarea>`, and `<select>` typically come in two different types: Controlled Components and Uncontrolled Components.

Let's start with the concept of controlled and uncontrolled components in React.

**Controlled Components**

A controlled component is a component where React is in control and is the single source of truth for the form data. As the term controlled suggests, it controls the values of the input fields in the form directly. 

Here's a simple example of a controlled component:

```jsx
import React, { useState } from 'react';

const ControlledComponent: React.FC = () => {
    const [name, setName] = useState('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <form>
            <label>
                Name:
                <input type="text" value={name} onChange={handleNameChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ControlledComponent;
```

In this example, the form data is stored in the local state (`name`) of the React component. When you type something into the `<input>`, it calls the `handleNameChange` function, which updates the state with the new value. This causes the component to re-render, and the new `name` value is passed to the `<input>`.

**Uncontrolled Components**

An uncontrolled component is where your form data is handled by the DOM, not the React state. The inputs are handled by React using refs.

Here's a simple example of an uncontrolled component:

```jsx
import React, { useRef } from 'react';

const UncontrolledComponent: React.FC = () => {
    const nameInput = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert(`Submitted Name: ${nameInput.current?.value}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" ref={nameInput} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default UncontrolledComponent;
```

In this example, to read the form value, you reference `nameInput.current.value`, which gives you direct access to the DOM element and its value.

To summarize, the primary difference between controlled and uncontrolled components is who maintains the form's state. In a controlled component, React does, and in an uncontrolled component, the DOM does. You typically reach for controlled components first, because they allow you to have more control and predictability in your state updates. However, there are times when you may need to use uncontrolled components, such as when integrating with non-React code.

---

Sure, uncontrolled components can be useful in a few scenarios:

1. **Handling Form Data with Non-React Code**: If you are integrating with older, non-React libraries that require direct access to the DOM, or if your form is doing something specific that requires access to the actual DOM elements, uncontrolled components may be a better fit.

2. **File Inputs**: File inputs are read-only and set to the file path. In this case, uncontrolled components are helpful as controlled components would not be able to manually set the file path.

    ```jsx
    import React, { useRef } from 'react';

    function FileUpload() {
        const fileInput = useRef();

        const handleSubmit = event => {
            event.preventDefault();
            alert(`Selected file - ${fileInput.current.files[0].name}`);
        };

        return (
            <form onSubmit={handleSubmit}>
                <label>
                    Upload file:
                    <input type="file" ref={fileInput} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        );
    }

    export default FileUpload;
    ```

3. **Immediate Input Validation**: If you want to check user input as soon as it is entered, uncontrolled components are very useful. You can use the reference to check the value and apply validation immediately.

4. **Performance Optimization**: In some cases, updating the state on every change event can affect performance. If you have a very large form or a form that has complex or expensive state update logic, it might be more performant to use uncontrolled components, as they don't cause a re-render on each keystroke.

Remember, React recommends using controlled components for forms in most cases because they allow for more predictable code. However, these are some cases where uncontrolled components might be more appropriate.
