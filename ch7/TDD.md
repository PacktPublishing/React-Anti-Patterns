# Chapter 2 - Todo Application - Basic Features

In this chapter, you will learn how to apply TDD (with react-testing-library) with a concrete example, we'll implement the essential user journey of a Todo Application, and we'll look for potential improvement from the next chapter.

## Get started with Todo application

Once we have set up the test mechanism, we can now start to look into our `Todo` app. Essentially, it's a list of items that reminds us what to do; we can add new items, edit existing ones, mark some as completed, and more.

![Todo Application](images/ms-todo.png)

For tasking, one possible split is:

- Renders one item
- Renders two items
- Add a new item to the todo list
- Mark one item as done
- Search for items by keywords

## Renders single item

Our first test could be as simple as copying the previous one:

```tsx
describe("Todo application", () => {
  it("renders a todo item", () => {
    render(<Todo items={["something need to be done"]} />);
    const element = screen.getByText("something need to be done");
    expect(element).toBeInTheDocument();
  });
});
```

And for implementation, it can be as simple as returning the string itself (I know it's cheating, but bear with me for now).

```tsx
const Todo = () => {
  return 'something need to be done'
}

export default Todo
```

## Renders multiple items

And as the tests are now passing, we can pretty confidently add the following item to our tasking list.

```tsx
it("renders multiple items", () => {
  render(<Todo items={["something need to be done", "another item"]} />);
  const element1 = screen.getByText("something need to be done");
  expect(element1).toBeInTheDocument();

  const element2 = screen.getByText("another item");
  expect(element2).toBeInTheDocument();
});
```

Now we have to write the actual code to make the second test pass. We may still fake it, but it may require more effort than just iterating the passed in array and rendering the items,

```tsx
const Todo = ({items}) => {
  return items.map(item => <li>{item}</li>)
}
```

and React would complain that each item in a list should have a key with it:

```
    console.error
      Warning: Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.
          at Todo (/Users/juntaoqiu/learn/qoolworths/src/Todo.tsx:1:15)
```

We'll address this issue in a minute, but for now, let's refactor the code a little bit. Simply extracting `items` as a variable can make the code a bit cleaner, and we can then use `items[0]` and `items[1]` to reference the value (and avoid repeating ourselves).

```tsx
it("renders multiple items", () => {
  const items = ["something need to be done", "another item"];

  render(<Todo items={items} />);

  const element1 = screen.getByText(items[0]);
  expect(element1).toBeInTheDocument();

  const element2 = screen.getByText(items[1]);
  expect(element2).toBeInTheDocument();
});
```

## Data structure of an item

A list of items is typically more complicated than a plain string in the real world. It comes with a unique id and may contain other fields like `createdAt`, `completed` and so on. We can change the tests first to make them more real.

```tsx
it("renders a todo item", () => {
  const items = [
    {
      id: 1,
      content: "something need to be done",
    },
  ];
  render(<Todo items={items} />);
  const element = screen.getByText("something need to be done");
  expect(element).toBeInTheDocument();
});
```

The tests will fail again as we're not using the `content` field in our implementation. Making the corresponding change is simple:

```tsx
const Todo = ({ items }) => {
  return items.map((item) => <li key={item.id}>{item.content}</li>);
};
```

Now all the tests are passing, and there are no more warnings!

## Add a new item to the todo list

Just passing an initial list of to-do items is a bit boring. It would be great to allow our users to add whatever items they want. It's pretty easy to express that in our test thanks to `react-testing-library`:

```tsx
it("adds item to list", () => {
  render(<Todo items={[]} />);

  const input = screen.getByTestId("test-input");
  fireEvent.change(input, { target: { value: "my new todo item" } });

  const button = screen.getByTestId("test-add-button");
  fireEvent.click(button);

  const element = screen.getByText("my new todo item");
  expect(element).toBeInTheDocument();
});
```

Here we initialise the `Todo` with an empty array. We want to trigger a change event to an input element and then expect a value to be added to the document. Note here that we use `getByTestId` to get an element from DOM by its test id. By default, the element with the data attribute `data-testid="test-input"` will be found. You can configure it in jest config to use other conventions (like `dataTestId`).

So the error message on your terminal should be something like:

```
    TestingLibraryElementError: Unable to find an element by: [data-testid="test-input"]
```

We can fix it by introducing an input element in our `Todo.tsx`:

```tsx
const Todo = ({ items }) => {
  return (
    <ol>
      <input type="text" data-testid="test-input" />
      <button data-testid="test-add-button">Add item</button>
      {items.map((item) => (
        <li key={item.id}>{item.content}</li>
      ))}
    </ol>
  );
};
```

and now the issue becomes:

```
    TestingLibraryElementError: Unable to find an element with the text: my new todo item. This could be because the text is broken up by multiple elements...
```

This is a proper failure - it means it can guide us directly towards the problem. In contrast, the above one is more of an infrastructure failure and should be fixed before making any other code changes.

All right, as we have this already, implementing the code should be pretty straightforward:

```tsx
const [value, setValue] = useState<string>("");

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

return (
  <ol>
    <input
      type="text"
      data-testid="test-input"
      value={value}
      onChange={onChange}
    />
    {items.map((item) => (
      <li key={item.id}>{item.content}</li>
    ))}
  </ol>
);
```

But it won't work. The item is not going to change after the input value changes. So basically, we need a state to hold the initial `items`, and they change it inside the `Todo` component:

```tsx
const Todo = ({ items }) => {
  const [value, setValue] = useState<string>("");
  const [todos, setTodos] = useState(items);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClick = () => {
    setTodos([...todos, { id: "x", content: value }]);
  };

  return (
    <ol>
      <input
        type="text"
        data-testid="test-input"
        value={value}
        onChange={onChange}
      />
      <button data-testid="test-add-button" onClick={onClick}>
        Add item
      </button>
      {todos.map((item) => (
        <li key={item.id}>{item.content}</li>
      ))}
    </ol>
  );
};
```

The tests are now passing. But you may have noticed already there are a bunch of ugly things going on here.

- The `id` of the newly added item is not unique
- `items` doesn't have a type associated, so it's easy to make mistakes
- The `ol` element contains an input element, which isn't normal

Let's do some cleanup.

We need some mechanism to generate a unique ID for each item for us, and the package `uuid` provides exactly what we need, so install it first:

```
yarn add uuid @types/uuid --save
```

and use it like so in our component:

```tsx
import {v4 as uuid} from "uuid";

// const id = uuid()
```

And then, we define a simple interface to make it more explicit:

```ts
interface Todo {
  id: string
  content: string
}
```

So eventually, we get working code like the following snippet:

```tsx
const Todo = ({ items = [] }: { items: Todo[] }) => {
  const [value, setValue] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>(items);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClick = () => {
    const id = uuid();
    setTodos([...todos, { id: id, content: value }]);
  };

  return (
    <div>
      <input
        type="text"
        data-testid="test-input"
        value={value}
        onChange={onChange}
      />
      <button data-testid="test-add-button" onClick={onClick}>
        Add item
      </button>
      <ol>
        {todos.map((item) => (
          <li key={item.id}>{item.content}</li>
        ))}
      </ol>
    </div>
  );
};
```

## Summary

In this chapter, we started with testing a single item, making it pass first, and then supporting multiple items. The code looked okay at this stage, and then we began to make it fancier by allowing users to add new items to the list. And as the code grows, we find it becomes unclean and need some extra work to tidy it up.

With enough tests already, we're confident to do the following clean up and refactoring (check out the next chapter). And in the end, our code will be in good shape and have good test coverage.
{sample: true}
# Chapter 3 - Refactor - Separation of Concerns

In this chapter we'll apply a common principle&mdash;separation of concerns&mdash;into our code to clean it up.

## Separation of concerns

At the end of the previous chapter, we made the Todo application render multiple items and add new items to the list. The final code is as follows:

```tsx
const Todo = ({ items = [] }: { items: Todo[] }) => {
  const [value, setValue] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>(items);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClick = () => {
    const id = uuid();
    setTodos([...todos, { id: id, content: value }]);
  };

  return (
    <div>
      <input
        type="text"
        data-testid="test-input"
        value={value}
        onChange={onChange}
      />
      <button data-testid="test-add-button" onClick={onClick}>
        Add item
      </button>
      <ol>
        {todos.map((item) => (
          <li key={item.id}>{item.content}</li>
        ))}
      </ol>
    </div>
  );
};
```

The above code works fine, but if we look at it closely, we will notice that it is a bit busy. There is logic to handle event handlers and to handle data manipulation (push data to an array) and code for rendering a to-do list.

Typically, that's a good sign to do a further split. For example, if we can split the reading and writing the logic of items and hide all the details of adding new items into the `todos` array, our code would become much cleaner.

## Extract a new component 

We can extract the `create new item` into a component, say, `TodoInput`:

```tsx
const TodoInput = ({ onAddItem }: { onAddItem: (item: Todo) => void }) => {
  const [value, setValue] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleAddItem = () => {
    const id = uuid();
    onAddItem({ id, content: value });
  };

  return (
    <>
      <input
        type="text"
        data-testid="test-input"
        value={value}
        onChange={onChange}
      />
      <button data-testid="test-add-button" onClick={handleAddItem}>
        Add item
      </button>
    </>
  );
};
```

All it does is respond to the change event, set the item value, and when the button is clicked, it populates a `Todo` item and callback an `onAddItem` event handler (which is passed in from its consumer).

## Using the new component in Todo application

As for the rendering logic that remains in the `Todo` component, it's much more readable too:

```tsx
const Todo = ({ items = [] }: { items: Todo[] }) => {
  const [todos, setTodos] = useState<Todo[]>(items);

  const onAddItem = (item: Todo) => {
    setTodos([...todos, item]);
  };

  return (
    <div>
      <TodoInput onAddItem={onAddItem} />
      <ol>
        {todos.map((item) => (
          <li key={item.id}>{item.content}</li>
        ))}
      </ol>
    </div>
  );
};
```

The most beautiful thing of all this is that we have the tests all passing, and these passing tests form a solid safety net that protects us from breaking existing code. So we have made the code much cleaner while having the confidence that the functionalities of our application remain intact.

## Summary

This chapter introduced a common technique we use in refactoring: separation of concerns. We split our code in a way that we hide some details in a subcomponent and only expose the public API (the HTML-like tag in React, like `TodoInput` or `Todo`), so in the calling place, we don't have to use our mind power to remember too many details.

That's a great way to clean our code up, and in future chapters, we will often see this technique.
{sample: true}
# Chapter 4 - Adding New Feature - Mark Item As Done

In this chapter, we'll keep working on TDD with another new feature and become more familiar with the `red-green-refactor` workflow.

## Adding a new test

Let's move on to another feature, marking an item as done. We should render an item first, then click it, and then assert that the element is not in the document anymore.

```tsx
it("marks item as done", () => {
  const items = [
    {
      id: 1,
      content: "a completed task",
    },
  ];

  render(<Todo items={items} />);

  const element = screen.getByText("a completed task");
  expect(element).toBeInTheDocument();

  fireEvent.click(element);
  expect(element).not.toBeInTheDocument();
});
```

As we need a new flag to indicate an item is done (or in the future, we may need to bring it back or review what we've done on a particular day), instead of deleting the item from the list, we can mark it as `completed` and filter it when rendering.

Tasking for this new feature could be:

- Change the type definition
- Handle an event on an item
- Filter out the completed items

## Type changes

We can update our type definition of `Todo` with the additional field `completed`:

```ts
interface Todo {
  id: string
  content: string
  completed?: boolean
}
```

## Handle click event on item

When rendering an item, we need to attach an event handler with it and bind the item id with that handler so we know which item to delete:

```tsx
todos.map((item: Todo) => (
  <li key={item.id} onClick={() => handleClickItem(item.id)}>
    {item.content}
  </li>
));
```

And for the `handleClickItem` function, we iterate the current `todos` and mark the item with the same id as `completed`.

```tsx
const handleClickItem = (id: string) => {
  setTodos(
    todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    })
  );
};
```

## Filter out completed items

The code is pretty straightforward. For now, we can do it right in the rendering step:

```tsx
todos
  .filter((todo: Todo) => !todo.completed)
  .map((item) => (
    <li key={item.id} onClick={() => handleClickItem(item.id)}>
      {item.content}
    </li>
  ));
```

Woohoo, all the tests are back to green!

Look at what we've achieved:

- Rendering a list of todos
- Adding a new item (clear the input box)
- Marking an item to complete it

Looks pretty promising, right? 

## Summary

This chapter extended our Todo application with one more feature - marking items as done. There are a lot of changes: types, state management, event handlers and so on. And as you might be aware, the code is a bit wild now. We'll learn other techniques to clean them up in the next chapter.

{sample: true}
# Chapter 5 - Refactor - Split Logic Into Custom Hook

In this chapter, we will learn how to use React hooks to simplify view code, and make the logic more encapsulated into a centric place.

## Another round of refactoring

The `Todo` component itself does not look super fancy, but it's fine. The component mainly deals with `todos` and editing and filtering when required. But I feel if we keep adding new logic (like more if-else statements), it will become more challenging to change/understand the code over time.

```tsx
const Todo = ({ items = [] }: { items: Todo[] }) => {
  const [todos, setTodos] = useState<Todo[]>(items);

  const onAddItem = (item: Todo) => {
    setTodos([...todos, item]);
  };

  const handleClickItem = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
  };

  return (
    <div>
      <TodoInput onAddItem={onAddItem} />
      <ol>
        {todos
          .filter((todo) => !todo.completed)
          .map((item) => (
            <li key={item.id} onClick={() => handleClickItem(item.id)}>
              {item.content}
            </li>
          ))}
      </ol>
    </div>
  );
};
```

The data manipulation (filter, add, mark as done) can be done in a particular place, and for `Todo`, it should only use data through an interface to that place. Ideally, in a React view, there should be only limited lines of calculation (if-else, filter and so on).

First, let's rename the `Todo` component to `TodoContainer` as it's doing many things already. Note that naming is always a critical factor in clean code, if not the most important one. We need to keep reviewing the name of things (variable, function, component, file name and so on). Once the underlying logic changes, the name should follow.

## Extract the TodoList component

In the above code, we can extract the list rendering part into its own component, and that component is only responsible for rendering a plain list of data:

```tsx
const TodoList = ({ items = [], handleClickItem }: { items: Todo[] }) => {
  return (
    <ol>
      {items.map((item) => (
        <li key={item.id} onClick={() => handleClickItem(item.id)}>
          {item.content}
        </li>
      ))}
    </ol>
  );
};
```

And the `TodoContainer` will pass in what the `TodoList` needs:

```tsx
return (
  <div>
    <TodoInput onAddItem={onAddItem} />
    <TodoList items={todos.filter(todo => !todo.completed)} handleClickItem={handleClickItem} />
  </div>
)
```

And I noticed we have `uuid` in both `TodoInput` and `TodoContainer`. Maybe it's a better idea to put them together to manage these fields altogether. Let's move the `uuid` invocation into the `TodoContainer` component.

```tsx
const onAddItem = (content: string) => {
  const item = { id: uuid(), content };
  setTodos([...todos, item]);
};
```

And then simplify `TodoInput` as:

```tsx
const handleAddItem = () => {
  onAddItem(value)
  setValue('')
}
```

## Custom hook for business logic

Once we have all the data manipulation and view placed correctly, it's pretty clear that we can extract a custom hook - used to handle all the data and view-only components. For example, if we put the half part into a `useTodos` hook:

```tsx
const useTodos = (items: Todo[]) => {
  const [todos, setTodos] = useState<Todo[]>(items);

  const addItem = (content: string) => {
    const item = { id: uuid(), content };
    setTodos([...todos, item]);
  };

  const markItemAsCompleted = (id: string) => {
    setTodos(
      todos
        .map((todo) => {
          if (todo.id === id) {
            todo.completed = !todo.completed;
          }
          return todo;
        })
        .filter((todo) => !todo.completed)
    );
  };

  return {
    todos,
    addItem,
    markItemAsCompleted,
  };
};
```

Using the hook in `TodoContainer` could simplify quite a lot of the logic.

```tsx
const TodoContainer = ({ items = [] }: { items: Todo[] }) => {
  const { todos, addItem, markItemAsCompleted } = useTodos(items);

  return (
    <div>
      <TodoInput onAddItem={addItem} />
      <TodoList items={todos} handleClickItem={markItemAsCompleted} />
    </div>
  );
};
```

Again, our tests are still passing as before. We have a very different structure already: all the logic and data modification are encapsulated into the `useTodos` hook, and both `TodoInput` and `TodoList` are reasonably simple plain rendering views.

## Summary

We've entirely split the UI logic and non UI logic in this lesson. The hook `useTodos` is a pure `.ts` file (not `.tsx`), and the `TodoContainer` is clean and does not have too many details to read.

A custom hook is a great way to reduce complexity in views, and whenever we see the long function body of a React component, we should consider if these calculations could be moved out into a hook.

## What we have learnt

In this chapter, we have covered some fundamental topics of Test-Driven Development, an approach to clean code with more confidence.

We've been working on a simple to-do application: `Todo`. We've covered some common techniques and principles of clean code, using `separation of concerns` to split subcomponents, and using hooks to extract logic unrelated to the UI. By adding small features one at a time with TDD, we've learnt how to write tests, make them pass with minimal effort, and seek refactoring.
