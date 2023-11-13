Welcome to this pivotal chapter on mastering React component design. In this chapter, we'll embark on an enriching journey to recognize and eradicate common anti-patterns in designing React components. These include issues like large monolithic components, prop drilling, and other prevalent pitfalls that often perplex developers and hamper the maintainability and scalability of React applications.

First, we'll introduce the Single Responsibility Principle (SRP). In the realm of React, this principle guides us to ensure that each component has one specific purpose. Adhering to the SRP makes components easier to understand, test, and maintain, all while making your code more readable and manageable.

Next, we'll explore the Don't Repeat Yourself (DRY) principle. One of the core tenets of effective programming, DRY encourages developers to minimize repetition and promote reuse. In the context of React, this principle can be the key to unlocking a more streamlined, efficient, and maintainable codebase.

Finally, we'll delve into the Use Composition principle. Composition allows us to build complex UIs by combining simpler, reusable components. In React, composition is favored over inheritance, leading to more flexible and easier-to-manage components.

Throughout this chapter, we'll take a deep dive into each of these principles, providing real-world examples and practical applications. By doing so, we aim to guide you in crafting more efficient components, bolstering your understanding of React's potential, and enhancing your problem-solving skills in this powerful library.

Let's step forward and unravel the power of effective React component design together. Here's to building more maintainable, scalable, and efficient React applications!

# Single Responsibility Principle

The Single Responsibility Principle (SRP) is one of the fundamental concepts in software engineering, which asserts that a function, class, or in the context of React, a component, should have only one reason to change.

In other words, each component should ideally handle a single task or functionality. Following this principle can make your code more readable, maintainable, and easier to test and debug.

Let's illustrate this with an example.

Suppose you initially have a `BlogPost` component that fetches blog post data, displays the post, and handles the user liking the post, all in one component.

```tsx
import React, { useState, useEffect } from "react";
import fetchPostById from "./fetchPostById";

interface PostType {
  id: string;
  title: string;
  summary: string;
}

const BlogPost = ({ id }: { id: string }) => {
  const [post, setPost] = useState<PostType>(EmptyBlogPost);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchPostById(id).then((post) => setPost(post));
  }, [id]);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
      <button onClick={handleClick}>{isLiked ? "Unlike" : "Like"}</button>
    </div>
  );
};

export default BlogPost;
```

The code defines a functional component called `BlogPost` that takes an `id` prop of type `string`. Inside the component, there are two state variables defined using the `useState` hook: `post` and `isLiked`. The `post` state represents the blog post data, initialized with a default value of an empty blog post. The `isLiked` state represents whether the post is liked or not, initialized as `false`.

The `useEffect` hook is used to fetch the blog post data from the server based on the provided `id`. It triggers the fetch operation whenever the `id` prop changes. Once the data is fetched, the `post` state is updated with the retrieved post using the `setPost` function.

For the network request function `fetchPostById`, it's simply a `fetch` call to a remote server and we can assume it is something the following code snippet for now.

```ts
const fetchPostById = (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({}), 2000);
  })
};
```

The component renders the title and summary of the blog post from the `post` state. It also renders a button that toggles the `isLiked` state when clicked, displaying "Like" or "Unlike" based on the current value of `isLiked`.

While this code works, it violates the Single Responsibility Principle. It's doing three separate things: fetching data, displaying the blog post, and handling the like functionality.

Let's refactor it into smaller, single-responsibility components:

```tsx
const useFetchPost = (id: string): PostType => {
  const [post, setPost] = useState<PostType>(EmptyBlogPost);

  useEffect(() => {
    fetchPostById(id).then((post) => setPost(post));
  }, [id]);

  return post;
};

const LikeButton: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  return <button onClick={handleClick}>{isLiked ? "Unlike" : "Like"}</button>;
};

const BlogPost = ({ id }: { id: string }) => {
  const post = useFetchPost(id);

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
      <LikeButton />
    </div>
  );
};
```

Here, we've refactored `BlogPost` into smaller, single-responsibility components: `useFetchPost` is a custom hook responsible for fetching the blog post data, `LikeButton` is a component responsible for handling the like functionality, and `BlogPost` is now just responsible for rendering the blog post content and the LikeButton. Each part has a single responsibility and could be tested and maintained independently, leading to a more manageable codebase.

Note here in the real world application, click a `like` button may send a API call to update the database, but I just skipped that part in here.

In the first section, we explored the Single Responsibility Principle (SRP). This principle encourages each component to take charge of a single piece of functionality, making our code more maintainable and understandable. We applied this principle to break down large, monolithic components into smaller, more manageable pieces. As we advance further into our design journey, our next section leads us to a principle that intertwines closely with the philosophy of SRP - the DRY or Don't Repeat Yourself principle.

# Don't Repeat Yourself

The Don't Repeat Yourself (DRY) principle is a fundamental concept in software development that aims to reduce repetition within the code. Following this principle leads to better maintainability, readability, and testability, and can prevent bugs that occur due to the duplication of logic.

Let's say you want to display a list of products and the user's cart side by side. The `ProductList` component will display the product's image, name, and price, with an 'Add to Cart' button. The `Cart` component will display a list of cart items with an 'Remove from Cart' button.

![](images/ch4-1.png)

A naive implementation of the `ProductList` might look like this:

```tsx
type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
};

const ProductList = ({
  products,
  addToCart,
}: {
  products: Product[];
  addToCart: (id: string) => void;
}) => (
  <div>
    <h2>Product List</h2>
    {products.map((product) => (
      <div key={product.id} className="product">
        <img src={product.image} alt={product.name} />
        <div>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
      </div>
    ))}
  </div>
);

export default ProductList;
```

This React functional component named `ProductList` that accepts two props: `products` (an array of product objects) and `addToCart` (a function used to add a product to a shopping cart).

Each product object is of type `Product`, which has the properties `id`, `name`, `image`, and `price`.

The component maps over the `products` array and renders a div for each product, including an image, product name, price, and an "Add to Cart" button. When the "Add to Cart" button is clicked, the `addToCart` function is invoked with the corresponding product's `id` as an argument.

The corresponding `Cart` is similarly:

```tsx
const Cart = ({
  cartItems,
  removeFromCart,
}: {
  cartItems: Product[];
  removeFromCart: (id: string) => void;
}) => (
  <div>
    <h2>Shopping Cart</h2>
    {cartItems.map((item) => (
      <div key={item.id} className="product">
        <img src={item.image} alt={item.name} />
        <div>
          <h2>{item.name}</h2>
          <p>${item.price}</p>
          <button onClick={() => removeFromCart(item.id)}>
            Remove from Cart
          </button>
        </div>
      </div>
    ))}
  </div>
);
```

The `Cart` component iterates over the `cartItems` array and for each item, it renders a div with the item's image, name, price, and a "Remove from Cart" button. When this button is clicked, it invokes the `removeFromCart` function with the respective item's `id` as an argument, signifying that this item should be removed from the cart.

To reduce the duplication and make each component only do one thing, we can extract a `LineItem` component.

```tsx
import { Product } from "./types";

const LineItem = ({
  product,
  performAction,
  label,
}: {
  product: Product;
  performAction: (id: string) => void;
  label: string;
}) => {
  const { id, image, name, price } = product;

  return (
    <div key={id} className="product">
      <img src={image} alt={name} />
      <div>
        <h2>{name}</h2>
        <p>${price}</p>
        <button onClick={() => performAction(id)}>{label}</button>
      </div>
    </div>
  );
};

export default LineItem;
```

We defined a functional component `LineItem` that renders a product's details and a button. It accepts properties for `product`, `performAction`, and `label`, and uses destructuring to extract the necessary values. The component returns JSX code to display the product's information and trigger the `performAction` function when the button is clicked.

And for the `ProductList` and `Cart` component, they can simply pass in different props to `LineItem` comopnent to reduce the duplication we had before. 

```tsx
const ProductList = ({
  products,
  addToCart,
}: {
  products: Product[];
  addToCart: (id: string) => void;
}) => (
  <div>
    <h2>Product List</h2>
    {products.map((product) => (
      <LineItem
        key={product.id}
        product={product}
        performAction={addToCart}
        label="Add to Cart"
      />
    ))}
  </div>
);
```

The new `ProductList` component receives `products` and `addToCart` as props. It renders a list of products, with each product having an "Add to Cart" button. Similarly, for `Cart` component we'll have the similar structure:

```tsx
const Cart = ({
  cartItems,
  removeFromCart,
}: {
  cartItems: Product[];
  removeFromCart: (id: string) => void;
}) => (
  <div>
    <h2>Shopping Cart</h2>
    {cartItems.map((item) => (
      <LineItem
        key={item.id}
        product={item}
        performAction={removeFromCart}
        label="Remove from Cart"
      />
    ))}
  </div>
);
```

This is a more maintainable and reusable approach by following the DRY principle.

In this section, we dove into the DRY principle. It guided us to eliminate redundancy in our code, reducing the likelihood of inconsistencies and bugs. By avoiding code duplication, we've simplified maintenance as changes in functionality need to be addressed at a single place. As we refined our understanding of DRY, we prepared ourselves to enhance our component structure using a key concept in React - composition.

# Using Composition

In React, composition is a natural pattern of the component model. It's how we build components from other components, in a "composition" similar to how we might compose functions, objects, or even a piece of writing. This pattern enables more straightforward reuse of components, which can contribute to cleaner and more maintainable code.

Let's consider an example:

Suppose we're building a `UserDashboard` component that displays user information. The profile includes an avatar, a name, and a list of the user's friends and the lastest posts.

Here's how it might look:

```tsx
type User = {
  name: string;
  avatar: string;
  friends: string[];
};

type Post = {
  author: string;
  summary: string;
};

type UserDashboardProps = {
  user: User;
  posts: Post[];
};

function UserDashboard({ user, posts }: UserDashboardProps) {
  return (
    <div>
      <h1>{user.name}</h1>
      <img src={user.avatar} alt="profile" />
      <h2>Friends</h2>
      <ul>
        {user.friends.map((friend) => (
          <li key={friend}>{friend}</li>
        ))}
      </ul>
      <h2>Latest Posts</h2>
      {posts.map((post) => (
        <div key={post.author}>
          <h3>{post.author}</h3>
          <p>{post.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default UserDashboard;
```

In this simplified example, `UserDashboard` is responsible for rendering the user's profile, a list of friends, and the latest posts, which violates the Single Responsibility Principle. We can break it down into smaller components, each responsible for one thing.

First, we create a `UserProfile` component that displays the user's profile:

```tsx
const UserProfile = ({ user }: { user: User }) => {
  return (
    <>
      <h1>{user.name}</h1>
      <img src={user.avatar} alt="profile" />
    </>
  );
};
```

Next, we create a `FriendList` component that displays a list of the user's friends:

```tsx
const FriendList = ({ friends }: { friends: string[] }) => {
  return (
    <>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend}>{friend}</li>
        ))}
      </ul>
    </>
  );
};
```

Finally, we create a `PostList` component that displays a feed of posts:

```tsx
const PostList = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      <h2>Latest Posts</h2>
      {posts.map((post) => (
        <div key={post.author}>
          <h3>{post.author}</h3>
          <p>{post.summary}</p>
        </div>
      ))}
    </>
  );
};
```

Now, our `UserDashboard` becomes simpler and delegates its responsibilities to these smaller components:

```tsx
function UserDashboard({ user, posts }: UserDashboardProps) {
  return (
    <div>
      <UserProfile user={user} />
      <FriendList friends={user.friends} />
      <PostList posts={posts} />
    </div>
  );
}
```

This is a simplified example, but it illustrates the basic idea of composition in React. Composition can become more complex as you deal with components that have their own state or logic, but the core principle remains the same: building larger components from smaller, reusable parts.

This section brought us to the power of Composition in React. With composition, we could efficiently structure and combine our components, creating complex user interfaces from simpler, single-responsibility components. We observed how composition allowed us to fully leverage the principles of SRP and DRY, leading to the creation of sophisticated UIs that remain easy to understand, test, and maintain.

# Exploring a more complicated case

Let's consider an example of a `Page` component, which might have many responsibilities such as managing the state and behavior for a header, sidebar, and main content area, and also a bunch of props for configuring each of these sections.

Here is a simplified example:

```tsx
import React from "react";

type PageProps = {
  headerTitle: string;
  headerSubtitle: string;
  sidebarLinks: string[];
  isLoading: boolean;
  mainContent: React.ReactNode;
  onHeaderClick: () => void;
  onSidebarLinkClick: (link: string) => void;
};

function Page({
  headerTitle,
  headerSubtitle,
  sidebarLinks,
  mainContent,
  isLoading,
  onHeaderClick,
  onSidebarLinkClick,
}: PageProps) {
  return (
    <div>
      <header onClick={onHeaderClick}>
        <h1>{headerTitle}</h1>
        <h2>{headerSubtitle}</h2>
      </header>
      <aside>
        <ul>
          {sidebarLinks.map((link) => (
            <li key={link} onClick={() => onSidebarLinkClick(link)}>
              {link}
            </li>
          ))}
        </ul>
      </aside>
      {!isLoading && <main>{mainContent}</main>}
    </div>
  );
}
```

We defined a `Page` React component, the component uses these props to render a page with a clickable header, a sidebar containing clickable links, and a main content section. And the component expects an object of type `PageProps` as its properties.

For each prop:

1. `headerTitle`: This string will be displayed as the main title in the page's header.
2. `headerSubtitle`: This string will be displayed as the subtitle in the page's header.
3. `sidebarLinks`: This is an array of strings, where each string represents a link that will be displayed in the page's sidebar.
4. `isLoading`: This is a flag to determin whether the main conteint is ready or not.
5. `mainContent`: This can be any valid React node (a component, an element, null, etc.) that represents the main content of the page.
6. `onHeaderClick`: This function will be executed when the header section of the page is clicked.
7. `onSidebarLinkClick`: This function will be executed when any sidebar link is clicked. The function will receive the clicked link as an argument.

This component has multiple responsibilities, and it has a long list of props that could make it hard to work with. A long props list normally a good indicator for breaking down.

We can group the props based on how they are used. The props `headerTitle`, `headerSubtitle` and `onHeaderClick` can be split out into a group, while the `isLoading` and `mainContent` belongs to another. 

Let's extract a Header component first:

```tsx
type HeaderProps = {
  headerTitle: string;
  headerSubtitle: string;
  onHeaderClick: () => void;
};

const Header = ({
  headerTitle,
  headerSubtitle,
  onHeaderClick,
}: HeaderProps) => {
  return (
    <header onClick={onHeaderClick}>
      <h1>{headerTitle}</h1>
      <h2>{headerSubtitle}</h2>
    </header>
  );
};
```

This `Header` component in React takes three props: `headerTitle`, `headerSubtitle`, and `onHeaderClick`. It renders a header with the provided title and subtitle. The `onHeaderClick` prop is a function that's called when the header is clicked.

And because it's already in `Header` component, we don't need the `header` prefix in the prop names. Let's rename these props:

```tsx
type HeaderProps = {
  title: string;
  subtitle: string;
  onClick: () => void;
};

const Header = ({
  title,
  subtitle,
  onClick,
}: HeaderProps) => {
  return (
    <header onClick={onClick}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </header>
  );
};
```

And the `Header` is now much clear and concise of what it does. We can extract a `Sidebar` component with the same approach. 

```tsx
type SidebarProps = {
  links: string[];
  onLinkClick: (link: string) => void;
};

const Sidebar = ({ links, onLinkClick }: SidebarProps) => {
  return (
    <aside>
      <ul>
        {links.map((link) => (
          <li key={link} onClick={() => onLinkClick(link)}>
            {link}
          </li>
        ))}
      </ul>
    </aside>
  );
};
```

The `Sidebar` component accepts an array of `links` and a `onLinkClick` function as props. It generates a list of clickable items from the `links` array. The `onLinkClick` function is triggered when a link is clicked, passing the clicked link as an argument.

Same thing for the main content, we can extract a `Main` component with the simple JSX fragment:

```tsx
type MainProps = {
  isLoading: boolean;
  content: React.ReactNode;
};

const Main = ({ isLoading, content }: MainProps) => {
  return <>{!isLoading && <main>{content}</main>}</>;
};
```

For the `Page` component now, we can invoke these simple components without changing the public interface of the `Page`.

```tsx
function Page({
  headerTitle,
  headerSubtitle,
  sidebarLinks,
  mainContent,
  isLoading,
  onHeaderClick,
  onSidebarLinkClick,
}: PageProps) {
  return (
    <div>
      <Header
        title={headerTitle}
        subtitle={headerSubtitle}
        onClick={onHeaderClick}
      />
      <Sidebar links={sidebarLinks} onLinkClick={onSidebarLinkClick} />
      <Main isLoading={isLoading} content={mainContent} />
    </div>
  );
}
```

The `Page` component, a composition of `Header`, `Sidebar`, and `Main` components, takes in several props. It then passes these props to the respective child components. `Header` gets title, subtitle, and a click handler. `Sidebar` receives a list of links and a click handler. Finally, the `Main` component gets the main content and a loading state.

The refactored `Page` looks much nicer, but it's not prefect. Let's consider a common issue about the current code. What happens if we need to passin a new props to `Sidebar` or `Main`? We need to extend the prop list which is already too long.

Instead of accepting these detailed descriptions to customise a Header or a Sidebar, we can passin a instance of a Header and then just plug it into the current slot. By saying that I mean

```tsx
type PageProps = {
  header: React.ReactNode;
  sidebarLinks: string[];
  isLoading: boolean;
  mainContent: React.ReactNode;
  onSidebarLinkClick: (link: string) => void;
};

function Page({
  header,
  sidebarLinks,
  mainContent,
  isLoading,
  onSidebarLinkClick,
}: PageProps) {
  return (
    <div>
      {header}
      <Sidebar links={sidebarLinks} onLinkClick={onSidebarLinkClick} />
      <Main isLoading={isLoading} content={mainContent} />
    </div>
  );
}
```

Now the `Page` component accepts a header component (along with a list of sidebar links, a loading state, main content, and a link click handler as props). It renders the header component **directly**. That means we can pass in any header instance from outside of `Page`. 

Similarly, we can do the same for `Sidebar` and `Main`:

```tsx
type PageProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
};

function Page({ header, sidebar, main }: PageProps) {
  return (
    <div>
      {header}
      {sidebar}
      {main}
    </div>
  );
}
```

And the `Page` component accepts three props: `header`, `sidebar`, and `main`, each of which is expected to be a `ReactNode`, a type that includes practically anything that can be rendered in React (strings, elements, arrays, etc.). The `Page` component simply renders these three props in a `div` in the order they are provided, effectively forming a simple page layout with a header, a sidebar, and a main section.

You can then use the `Page` with the most flexiable way like:

```tsx
const MyPage = () => {
  return (
    <Page
      header={
        <Header
          title="My application"
          subtitle="Product page"
          onClick={() => console.log("toggle header")}
        />
      }
      sidebar={
        <Sidebar
          links={["Home", "About", "Contact"]}
          onLinkClick={() => console.log(`toggle sidebar`)}
        />
      }
      main={<Main isLoading={false} content={<div>The main</div>} />}
    />
  );
};
```

This `MyPage` component renders a `Page` component, passing in `Header`, `Sidebar`, and `Main` components as props. Click events on the `Header` and `Sidebar` components will log certain messages to the console. 

The original `Page` component was heavily burdened with a multitude of responsibilities, leading to a long list of props. This design presented a "prop drilling" problem, where a large amount of data had to be passed down through multiple layers of components. This setup was both complex and hard to maintain.

The refactoring process started by breaking down the monolithic `Page` component into smaller, more manageable components: `Header`, `Sidebar`, and `Main`. These sub-components were designed to handle their respective responsibilities, thus simplifying their individual prop requirements.

Once these components were extracted, we modified the `Page` component to accept these sub-components (`Header`, `Sidebar`, `Main`) as props. This technique is known as "component composition", where the `Page` component acts as a composition of other components. This approach significantly reduced the prop drilling issue, as each sub-component now receives props directly at the point of usage.

This refactoring exercise streamlined the `Page` component, resulting in a cleaner, more manageable codebase. It utilized the principles of component composition and single responsibility to solve the prop drilling problem effectively.

# Summary

This chapter covered several key principles in designing and developing components in React: the Single Responsibility Principle (SRP), Don't Repeat Yourself (DRY), and the use of Component Composition. Each of these principles provides different strategies for achieving clean, maintainable, and scalable codebases.

The Single Responsibility Principle recommends that a component should ideally only do one thing. If it ends up growing, it should be decomposed into smaller subcomponents. This principle enables components to be more manageable, easier to understand, and more reusable. Each component becomes a single building block that can be easily tested and refactored without causing side effects in other areas of the application.

The Don't Repeat Yourself principle advocates for avoiding redundancy in our code. When we notice repetitive patterns, whether they're identical prop lists, repeated logic, or similar structures, we should consider abstracting this commonality into a separate component or custom hooks. This leads to less code to maintain, fewer bugs, and an easier-to-extend codebase.

Lastly, Component Composition refers to the practice of building more complex components from simpler ones. Rather than creating monolithic components with many responsibilities and a long list of props, we should aim to make our components composable. This approach allows us to encapsulate complexity within individual components and assemble them to create more complex UIs, avoiding "prop drilling" and leading to more readable and maintainable code.

By understanding and applying these principles, we can create a solid foundation for our React applications. These strategies lead to more organized, scalable, and robust codebases, ultimately making our work as developers more effective and enjoyable.