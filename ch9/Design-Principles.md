Design principles are like the cardinal rules that guide software development, ensuring that code remains maintainable, scalable, and readable over time. In the ever-changing landscape of technology, adhering to these principles can be the difference between a project's long-term success and its descent into "code hell," where changes become increasingly arduous and bugs frequent.

For React applications, the importance of design principles escalates due to the library's declarative nature and component-based architecture. React empowers developers to build complex UIs from small, isolated pieces of code known as components. While this modular approach is one of React’s strongest features, it can also lead to a messy and unmanageable codebase if design principles are ignored.

In a typical React project, components often share state and behavior, get nested within each other, and are reused across different parts of an application. Without following design principles, you might find yourself entangled in a web of dependencies, making it difficult to change or even understand the code. For instance, neglecting the Single Responsibility Principle could result in components that are difficult to test and refactor, while ignoring Interface Segregation could make your components less reusable and more coupled to specific use-cases.

Furthermore, as React continues to evolve, with new features like hooks and concurrent mode, having a design principle-centered approach ensures that you can adapt to these changes without significant rewrites. This allows you to focus on building features, fixing bugs, and delivering value, instead of grappling with technical debt.

Adhering to design principles in React development is not just a best practice but a necessity. It serves as a proactive measure to counteract complexity, making your React code easier to read, test, and maintain.

In this chapter, we will cover the following topics:

- Revisiting Single Responsibility Principle
- Embracing interface mindset
- Understainding CQRS in React

In this chapter, we commence by revisiting the Single Responsibility Principle, a core concept that often serves as the bedrock of clean, maintainable code. From the humble beginnings of a simple string transforming function, we'll explore how this principle scales up to the complexities of render props, enriching the structure and readability of your React components.

Transitioning from there, we introduce the 'Interface Mindset,' a transformative approach to component design. This section emphasizes that focusing on the interface—not the nitty-gritty details of implementation—is the pathway to reusable and easily understandable components.

Concluding the chapter, we delve into Command Query Responsibility Segregation (CQRS), a pattern that gains importance as your React applications grow in size and complexity. Through a discussion on CQRS, you'll discover strategies to separate your application's command and query responsibilities, thereby making it more manageable and scalable.

This chapter aims to equip you with a holistic understanding of key design principles, which in turn will lay a strong foundation for the rest of your journey in mastering React.

# Technical requirements

A GitHub repository has been created to host all the code we discuss in the book. For this chapter, you can find the recommended structure under https://github.com/PacktPublishing/React-Anti-Patterns/tree/main/ch9.

# Revisiting Single Responsibility Principle

We've talked about Single Responsibility Principle in chapter 4: Design Components. However, as many other fundamental principles, it apply to many other cases in different levels. Let's dive into a bit deep on other scenarios about the principle by starting from simple component.

```ts
const Title = () => <div>Title ｜ This is a title</div>
```

```ts
const Title = ({title}: {title: string}) => <div>Title ｜ {title}</div>
```

```ts
const Title = ({title, transformer}: {title: string, transformer: (s: string) => string}) => <div>Title ｜ {transformer(title)}</div>
```

```ts
const Title = ({title, render}: {title: string, render: (s: string) => React.ReactNode}) => <div>{render(title)}</div>
```

```ts
<Title title="This is a title" render={(s: string) => {
    const formatted = s.toUpperCase();
    return <h3>{formatted}</h3>
}}>
```

```ts
const Title = ({title, children}: {title: string, children: (s: string) => React.ReactNode}) => <div>{children(title)}</div>
```

```ts
<Title title="This is a title">
    {
        (s: string) => {
            const formatted = s.toUpperCase();
            return <h3>{formatted}</h3>
        }
    }
</Title>
```

Note the pattern here: try to extract a concept from a few instances: h2 or h3 are all different instances of heading, and once we have extracted heading, we notice that we are not limited by heading, but a broader concept: component(ReactNode) and then the render props or children make more sense.

Once we have a generic component (with render prop here), we can then concretely pass in an instance of that abstraction. But the beautiful thing is that we only write the generic code once, and all the other places are only the usage of it — even in the unit tests.

## Identifing the core functionality

Identifying the core responsibility of a component is key to adhering to the Single Responsibility Principle. Once you isolate what the component is fundamentally meant to do, it becomes easier to refactor and abstract out the auxiliary functionalities. 

Composition and render props are excellent techniques for this. They allow you to extend or customize the behavior of a component without altering its core logic. This keeps your components clean, modular, and easy to test, as each component does one thing and does it well. It also makes the system as a whole more maintainable and understandable, as future developers (or even future you) can easily grasp what each part of your application is supposed to do.
