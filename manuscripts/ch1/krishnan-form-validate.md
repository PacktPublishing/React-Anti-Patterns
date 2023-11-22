
```tsx
import React, { ChangeEvent, useState } from "react";

const Form = () => {
  const [value, setValue] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^\w\s]/gi, "");
    setValue(sanitizedValue);
  };

  return (
    <div>
      <form>
        <label>
          Input without special characters:
          <input type="text" value={value} onChange={handleChange} />
        </label>
      </form>
    </div>
  );
};

export default Form;
```

This `Form` component consists of a single text input field that restricts input to alphanumeric characters and spaces. It uses a state variable `value` to store the input field's value. The `handleChange` function, triggered on each input change, removes any non-alphanumeric characters from the user's input before updating the state with the sanitized value. 

```tsx
const Timer = () => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      console.log("time is up")
    }, 1000);

    return () => {
      clearTimeout(timerId)
    }
  }, [])

  return <div>
    Hello timer
  </div>
}
```

We defined Timer component in the code above, and within it, the useEffect hook is used to handle a side effect.
As the component mounts, a setTimeout function is set up to log the message "time is up" after a delay of 1000 milliseconds. The useEffect hook then returns a cleanup function, it to prevent memory leaks. This cleanup function uses clearTimeout to clear the timer identified by timerId when the component unmounts.

```tsx
useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;
  const fetchArticleDetail = async (id: string) => {
    fetch(`/api/articles/${id}`, { signal })
      .then((res) => res.json())
      .then((data) => setArticle(data));
  };

  fetchArticleDetail(id);

  return () => {
    controller.abort();
  };
}, [id]);
```

In this code snippet, an AbortController is used within a `useEffect` hook to manage the lifecycle of a network request. When the component mounts, the `useEffect` hook triggers, creating a new instance of AbortController and extracting its `signal`. This signal is passed to the `fetch` function, linking the request to the controller. 

If the component unmounts before the request completes, the cleanup function (`return () => { controller.abort(); }`) is called, using the `abort` method of the controller to cancel the ongoing fetch request. This prevents potential issues like updating the state of an unmounted component, ensuring better performance and avoiding memory leaks.