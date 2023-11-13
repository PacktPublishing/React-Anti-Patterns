Welcome to the fascinating world of refactoring! In this chapter, we're going to explore the basics of this fundamental practice, essential for every developer in maintaining and improving a codebase. We aim to introduce you to the most common refactoring techniques, providing a solid foundation for understanding and employing these valuable tools. Remember, our objective is not to provide an exhaustive guide, but rather to familiarize you with the essentials that you'll use time and time again in your programming journey.

Refactoring doesn't discriminate among languages or frameworks - it's a universal concept applicable anywhere you write code. The techniques we'll discuss include renaming variables, changing function declarations, extracting functions, moving fields, and more. These techniques might appear simple at first glance, but they are incredibly powerful tools in crafting clean, understandable, and maintainable code.

Remember, refactoring is not a one-time task, but rather an ongoing process of small, iterative changes that gradually enhance the structure and quality of your code. It is these frequent, incremental improvements that keep a codebase healthy, robust, and easier to work with. By introducing you to the basics, we hope to equip you with the essential tools and techniques that will be a stepping stone towards more advanced refactoring methods.

While we'll delve into more complex refactoring techniques in later chapters, the practices you'll learn here will serve as a valuable starting point. By the end of this chapter, you'll have a toolkit of common refactoring practices, and a newfound understanding of their importance in enhancing code quality. Ultimately, the refactoring skills you begin to develop here will empower you to write cleaner, more efficient code, and set you on the path to becoming a more proficient developer. Let's dive in!

In this chapter, we will cover the following topics:

- Understanding refactoring
- Adding tests before you make any changes
- Renaming variable
- Choosing the right tools
- Extracting variable
- Replacing Loop with Pipeline
- Extracting function
- Introducing Parameter Object
- Decomposing Conditional
- Moving Function

# Technical requirements

A GitHub repository has been created to host all the code we discuss in the book. For this chapter, you can find the recommended structure under https://github.com/PacktPublishing/React-Anti-Patterns/tree/main/ch6.

# Understanding refactoring

**Refactoring** is a disciplined, systematic process of improving the design of an existing codebase without changing its external behavior. It's a fundamental aspect of everyday coding, a practice integral to the iterative and incremental nature of software development. The concept is universally applicable, not bound to any specific programming language, framework, or paradigm. Whether you're writing in JavaScript, Python, or any other language, and whether you're using React, Angular, or a homegrown framework, refactoring is crucial for maintaining a healthy codebase.

The term "refactoring" was first introduced by William Opdyke and Ralph Johnson in a 1990 paper titled "Refactoring: An Aid in Designing Application Frameworks and Evolving Object-Oriented Systems." However, the concept and practice of refactoring have roots in earlier practices in software engineering.

The art of refactoring gained significant prominence with Martin Fowler's book "Refactoring: Improving the Design of Existing Code" published in 1999. In this book, Fowler describes refactoring as "a controlled technique for improving the design of an existing codebase," emphasizing its role in mitigating the buildup of technical debt, making the code easier to understand, maintain, and extend.

Refactoring isn't about making one grand, sweeping change to perfect the codebase. Instead, it's about making small, incremental improvements consistently over time. Each individual change might not dramatically alter the quality of the code, but collectively, over time, these small changes can significantly enhance the structure, readability, and maintainability of the codebase.

Although refactoring doesn't add new functionality, it directly influences the team's ability to deliver new features more quickly, with fewer bugs, and to respond more flexibly to changing requirements. By continuously refactoring, we keep our code clean and easy to work with, and set the stage for long-term, sustainable development.

In conclusion, refactoring is a critical tool in a developer's toolkit, irrespective of the technology stack or the size and scope of the project. It’s a long-term investment in the codebase and the team, and ultimately, it’s an investment in the quality of the software that is delivered.

## The common mistakes

The terms "restructuring" and "refactoring" are often used interchangeably, but they have distinct meanings in software development.

**Refactoring** is a disciplined technique for improving the design of an existing code base, making it cleaner and easier to understand and work with. It involves changing the internal structure of the software without modifying its external behavior. This is generally done in small steps, and each refactoring step is expected to maintain the software's functionality. It doesn't add new features; instead, it makes the code more readable, maintainable, and prepared for future changes.

For example, in a React application, refactoring could involve breaking down a large component into smaller, more manageable components, or replacing complex conditional logic with a strategy pattern.

**Restructuring**, on the other hand, can be seen as a broader and more drastic process. It often involves large-scale changes that not only impact the internal structure of the software, but can also affect its external behavior. Restructuring can encompass changes to the software's architecture, data models, interfaces, and more. It is often driven by the need to introduce major changes or additions to the software's features or capabilities, to improve performance, or to address significant technical debt.

In the context of a React application, restructuring might involve changing the state management solution (like moving from Redux to the React Context API), updating the routing mechanism, or transitioning from a monolithic architecture to a micro-frontends architecture.

While both refactoring and restructuring aim to improve the quality of the codebase, refactoring is typically smaller in scope, involves no change in functionality, and is part of the regular development process. In contrast, restructuring is generally larger in scope, can change functionality, and is often part of a larger project or initiative to address more significant challenges or changes in requirements.

# Adding tests before you make any changes

Because we don't want to change any obserable behaviour changes during the refactoring, we need to inspect the code to make sure we have enough tests to cover the current behaviour. It's easy to mess up without the right tests in place, and that's not only risky but less efficient as we need to check the changed code manually, and repeatily. 

Let's say we have some code need some more work. The code works well, but there isn't any tests associated to it. To improve the code to be more easy to understand and extend, we need to refactor it.

```ts
interface Item {
  id: string;
  price: number;
  quantity: number;
}

class ShoppingCart {
  cartItems: Item[] = [];

  addItemToCart(id: string, price: number, quantity: number) {
    this.cartItems.push({ id, price, quantity });
  }

  calculateTotal() {
    let total = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      let item = this.cartItems[i];
      let subTotal = item.price * item.quantity;
      if (item.quantity > 10) {
        subTotal *= 0.9;
      }
      total += subTotal;
    }
    return total;
  }
}

export { ShoppingCart };
```

This code is defining a shopping cart model. Firstly, it defines an `Item` interface, which represents an item to be added to the cart. An `Item` consists of an `id`, a `price`, and a `quantity`. Then, it defines a `ShoppingCart` class, with a `cartItems` property, which is an array of `Item` objects, initially empty.

The `ShoppingCart` class has two methods: `addItemToCart` and `calculateTotal`. The `addItemToCart` method accepts an `id`, `price`, and `quantity`, and then creates an item using these parameters. This item is then added to the `cartItems` array. The `calculateTotal` method calculates the total price of the items in the cart. For each item, it multiplies the item's price by its quantity to get a subtotal. If the quantity of the item is more than 10, a 10% discount is applied to the subtotal. The subtotal of each item is then added together to get the total. The total is then returned by the method.

There are two important calculation here: compute the total price (price by quantity) and apply discount when eligiable. That means we at least will need to add two test cases before making changes.

```ts
import { ShoppingCart } from "../ShoppingCart";

describe("ShoppingCart", () => {
  it("calculates item prices", () => {
    const shoppingCart = new ShoppingCart();
    shoppingCart.addItemToCart("apple", 2.0, 2);
    shoppingCart.addItemToCart("orange", 3.5, 1);

    const price = shoppingCart.calculateTotal();
    expect(price).toEqual(7.5);
  });

  it('applies discount when applicable', () => {
    const shoppingCart = new ShoppingCart();
    shoppingCart.addItemToCart("apple", 2.0, 11);

    const price = shoppingCart.calculateTotal();
    expect(price).toEqual(19.8);
  })
});
```

The first test "calculates item prices" is verifying that the `calculateTotal` method works as expected when no discounts are applied. Here, a `ShoppingCart` object is instantiated and two items ("apple" and "orange") are added to the cart. The total price of these items is calculated and expected to be 7.5, as there are two apples at $2 each and one orange at $3.5.

The second test "applies discount when applicable" is checking that the `calculateTotal` method correctly applies a 10% discount when the quantity of an item is more than 10. In this case, a `ShoppingCart` object is instantiated and one type of item ("apple") is added to the cart with quantity 11. The total price of this item should be $19.8 after applying the 10% discount on the subtotal of $22 (11 apples at $2 each). The calculated total price is then checked against this expected value.

# Renaming Variable

Let's start with a simple refactoring called Rename Variable. The "Rename Variable" refactoring is a very straightforward yet effective method to improve the readability and maintainability of the code. It involves changing the name of a variable to better reflect its purpose, the data it holds, or to follow a certain naming convention or standard.

Sometimes, during the initial phases of coding, developers might choose names for variables that make sense at that time, but as the code evolves, the purpose of the variable might change or become clearer. The variable name, however, often remains the same. This can cause confusion and make the code harder to understand and maintain. Renaming variables to more accurately describe their purpose can reduce the cognitive load for future readers of the code, including the future self of the current coder.

The variable name "cartItems" inside ShoppingCart class is a little duplicate, we can rename it to simply "items" to be more concise and clean.

```ts
class ShoppingCart {
  items: Item[] = [];

  addItemToCart(id: string, price: number, quantity: number) {
    this.items.push({ id, price, quantity });
  }

  calculateTotal() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      let subTotal = item.price * item.quantity;
      if (item.quantity > 10) {
        subTotal *= 0.9;
      }
      total += subTotal;
    }
    return total;
  }
}
```

We can simply search and replace all the `items` usages from the code. After the change, make sure to run the tests again to see if we accidentally made any mistakes. It's important to establish a habit of running tests regularly after make some changes, and whenever the tests failed we need to stop and examine what is wrong.

This is only a few lines of code, so search and replace isn't a bit deal. But what if it's a public function we're chaning and it has been used in 30 modules? We need some advanced tools to change all the usages automatically when we make changes in one place.

# Choosing the right tools

There are many Integrated Development Environments (IDEs) and source code editors available in frontend world. But WebStorm and Visual Studio Code (VSCode) are the most popular ones that offer an impressive range of features, including robust refactoring capabilities. 

WebStorm, developed by JetBrains, is a powerful and feature-rich IDE specifically designed for JavaScript and its related technologies like TypeScript, HTML, and CSS. One of its most notable features is its advanced automated refactorings. WebStorm offers an extensive list of refactoring options like rename, extract, inline, move, and copy, which can be applied to variables, classes, functions, and other elements. It also has a smart duplication detection feature, helping you to locate and resolve repetitive blocks of code. WebStorm's IntelliSense, auto-complete, and code navigation are quite robust, giving you a lot of help when writing and exploring the code. However, WebStorm is a commercial product, and while it does offer a trial period, you will need to purchase a license for continued use.

![Figure 6-1. The WebStorm IDE](ch6/webstorm.png)

VSCode, on the other hand, is a free, open-source IDE developed by Microsoft. It's lightweight compared to WebStorm and is known for its speed and flexibility. VSCode also supports a wide range of languages beyond JavaScript, thanks to its extension marketplace. Refactoring capabilities in VSCode are strong as well, with support for common operations such as renaming, extracting functions or variables, and changing function signatures. VSCode's refactoring capabilities can be further enhanced by installing extensions, and its customizability is one of its key strengths. While VSCode may not have as many automated refactoring features as WebStorm out of the box, it can be tailored to match and sometimes exceed WebStorm's capabilities through these extensions.

![Figure 6-2. The WebStorm IDE](ch6/vscode.png)

Choosing between the two often boils down to personal preference and the specific needs of your project. If you value a highly automated, feature-rich environment and don't mind paying for it, WebStorm might be your best bet. However, if you prioritize speed, flexibility, and customization and are comfortable setting up your environment through extensions, VSCode could be the better choice.

I prefer WebStorm as my IDE at work, part of the reason is I have already very familiar with the keymaps and I love the auto refactoring capbility it built-in. And for the causal projects I use VSCode as well.

# Extracting Variable

"Extract Variable" is a common refactoring technique that is used to improve the readability and maintainability of code. The process involves taking a section of code that calculates a value, replacing it with a new variable, and assigning the result of the original expression to this new variable.

This refactoring technique is particularly useful when you have a complex expression or a duplicated calculation. By extracting parts of the expression to variables with meaningful names, the code becomes more understandable and easier to manage.

In the ShoppingCart, the discount rate 0.9 deserves its own name, we can extract a variable and use it in the calling place. As the value of the variable isn't going to change at run time, we can call it "Extract Constant" as well in this case.

```ts
const DISCOUNT_RATE = 0.9;

class ShoppingCart {
  //...
  calculateTotal() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      let subTotal = item.price * item.quantity;
      if (item.quantity > 10) {
        subTotal *= DISCOUNT_RATE;
      }
      total += subTotal;
    }
    return total;
  }
  //...
}
```

In this instance, we've created a constant named `DISCOUNT_RATE` and used it in place of the previous hard-coded value of `0.9` where it's utilized in the code. For the sake of clarity, other portions of the code that aren't relevant to this particular change have been left out of the discussion.

# Replacing Loop with Pipeline

The "Replace Loop with Pipeline" refactoring technique, as the name implies, is about replacing a loop structure with a pipeline of transformations, commonly achieved by using higher-order functions or methods like map, filter, and reduce in functional programming languages. 

In the case of JavaScript, the Array prototype has methods like map, filter, and reduce which can be chained together to form a pipeline. Each of these methods receives a function as an argument and applies this function to each element in the array, effectively transforming the array in some manner.

However, keep in mind that while replacing loops with pipelines can make the code cleaner and more readable, it might not always be the most efficient option, especially when dealing with very large data sets. So, as with all refactorings, you need to balance readability and maintainability with performance requirements.

```ts
class ShoppingCart {
  //...
  calculateTotal() {
    return this.items.reduce((total, item) => {
      let subTotal = item.price * item.quantity;
      return total + (item.quantity > 10 ? subTotal * DISCOUNT_RATE : subTotal);
    }, 0);
  }
  //...
}
```

The `calculateTotal()` method is using the `reduce()` function to calculate the total price of items in the shopping cart. The `reduce()` function is a higher-order function that applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single output value.

The total starts at 0 and then for each item in the shopping cart, it adds the `subTotal` of that item to the `total`. The `subTotal` is calculated by multiplying the `price` and `quantity` of each item. 

And we need to re-run all the tests to check if everything goes well.

# Extracting Function

"Extract Function" is a refactoring technique that helps to improve code readability and maintainability by breaking down a large or complex function into smaller, more manageable parts.

Let's say you come across a function that's performing multiple tasks. Maybe it's doing some data validation, then some computations, and finally logging the result or updating some state. The function is long and complex, making it hard to understand at a glance what it's doing.

"Extract Function" refactoring is all about identifying those distinct pieces of functionality, pulling them out into their own separate functions, and then calling those new functions from the original one.

One key benefit is that it makes the code more self-documenting. If you extract a part of your function to a new function and give it a meaningful name, it can often make the code much easier to understand since the function name can describe what the code is doing. It also improves the reusability of the code, since these smaller functions can be reused elsewhere if needed.

Currently, the logic of how to calculate the subTotal can be extracted as a separate unit.

```ts
function applyDiscountIfEligible(item: Item, subTotal: number) {
  return item.quantity > 10 ? subTotal * DISCOUNT_RATE : subTotal;
}

class ShoppingCart {
  //...

  calculateTotal() {
    return this.items.reduce((total, item) => {
      let subTotal = item.price * item.quantity;
      return total + applyDiscountIfEligible(item, subTotal);
    }, 0);
  }
}
```

In this code snippet, we see the result of an "Extract Function" refactoring. The logic to apply a discount if the item quantity is greater than 10 has been extracted into its own function named `applyDiscountIfEligible`.

In the `ShoppingCart` class, the `calculateTotal` method calculates the total price of items in the cart using the `reduce` function. For each item, it computes the subtotal as the product of item's price and quantity, then adds this subtotal (after applying any eligible discount) to the total.

The function `applyDiscountIfEligible` takes an `item` and its `subTotal` as arguments. If the quantity of the item is more than 10, it applies a discount rate (represented by `DISCOUNT_RATE`) to the `subTotal`; otherwise, it simply returns the `subTotal` as it is. 

This refactoring makes the `calculateTotal` method more concise and easier to read, by abstracting away the details of how discounts are applied into a separate, appropriately named function.

# Introducing Parameter Object

"Introduce Parameter Object" is a refactoring technique used when a function has a large number of parameters, or when multiple functions share the same parameters. In this technique, you group related parameters into a single object and pass that object to the function instead.

A large number of parameters in a function can be confusing and difficult to manage. Grouping related parameters together into an object can increase code readability and make it easier to understand what the function does. It also makes the function call simpler and cleaner. Furthermore, if the same group of parameters is used in multiple function calls, this technique reduces the chances of passing parameters in the wrong order.

For example, consider a function `calculateTotalPrice(quantity, price, discount)`. We could refactor this using the "Introduce Parameter Object" technique to become `calculateTotalPrice({ quantity, price, discount })`. Now, the parameters `quantity`, `price`, and `discount` are grouped together into an object (with type `Item`).

```ts
class ShoppingCart {
  items: Item[] = [];

  addItemToCart({id, price, quantity}: Item) {
    this.items.push({ id, price, quantity });
  }

  //...
}
```

On top of these benefits, the "Introduce Parameter Object" refactoring can often reveal or inspire domain concepts that were previously hidden and implicit in your code. The parameter object might become a class of its own, with its own behavior and data manipulation methods. This can lead to more object-oriented and encapsulated code.

# Decomposing Conditional

"Decompose Conditional" is a refactoring technique where the logic within a conditional statement (if-else or switch) is extracted into separate functions. This technique helps to improve the readability of the code, making it more understandable.

The condition, then-clause, and else-clause (if it exists) all get their own function. These functions are then named according to what they do or what they are checking for. This refactoring is beneficial because it replaces code that might need comments to understand with well-named functions, making the code self-explanatory.

For example, the logic in function `applyDiscountIfEligible` can actually be simplified by this refactoring. We can extract a small function and replace the check `item.quantity > 10`.

```ts
function isDiscountEligible(item: Item) {
  return item.quantity > 10;
}

function applyDiscountIfEligible(item: Item, subTotal: number) {
  return isDiscountEligible(item) ? subTotal * DISCOUNT_RATE : subTotal;
}
```

In the code snippet, the extraction of logic into a separate function might appear superfluous because it adds an additional function call. However, it enhances readability and reusability. 

```ts
function isDiscountEligible(item: Item) {
  return item.quantity > 10;
}

function applyDiscountIfEligible(item: Item, subTotal: number) {
  return isDiscountEligible(item) ? subTotal * DISCOUNT_RATE : subTotal;
}
```

In this code snippet, we've separated the logic that determines if an item is eligible for a discount into a standalone function `isDiscountEligible`. This extraction makes our `applyDiscountIfEligible` function cleaner and its intention more evident. Additionally, it allows for the `isDiscountEligible` logic to be updated independently if needed in the future, improving maintainability.

# Moving Function

"Moving Function" is a refactoring method that involves changing the location of a function to a more suitable or appropriate place. This could be within the same class, to a different class, or even to a separate module. The objective of this method is to enhance the readability, maintainability, and structure of the code by ensuring that functions are placed where they logically fit best. 

This kind of refactoring becomes necessary when the responsibilities of your classes evolve over time. You might find that a function makes more sense in a different class, or perhaps you have a group of functions within a class that work together and would be better suited in their own class or module. 

"Moving Function" refactoring can help in reducing the complexity of the class by moving functions to the places where their functionality is most relevant or required. This promotes the principle of cohesion where related code is kept together. It also aids in achieving loose coupling by minimizing unnecessary dependencies between different parts of the code. 

In our ShoppingCart, we can move the type definition into a new file called `types.ts`. And also we can move DISCOUNT_RATE, isDiscountEligible and applyDiscountIfEligible into a separate file `utils.ts`.

```ts
import { Item } from "./types";

const DISCOUNT_RATE = 0.9;

function isDiscountEligible(item: Item) {
  return item.quantity > 10;
}

export function applyDiscountIfEligible(item: Item, subTotal: number) {
  return isDiscountEligible(item) ? subTotal * DISCOUNT_RATE : subTotal;
}
```

Note in the code above, only `applyDiscountIfEligible` is a public function and can be accessed outside of the file. This refactoring also improves the encapsulation of the code.

And after the "Move Function", the ShoppingCart is simplified significantly and only have the necessary parts:

```ts
import { Item } from "./types";
import { applyDiscountIfEligible } from "./utils";

class ShoppingCart {
  items: Item[] = [];

  addItemToCart({ id, price, quantity }: Item) {
    this.items.push({ id, price, quantity });
  }

  calculateTotal() {
    return this.items.reduce((total, item) => {
      let subTotal = item.price * item.quantity;
      return total + applyDiscountIfEligible(item, subTotal);
    }, 0);
  }
}

export { ShoppingCart };
```

As with all refactoring, care should be taken when moving functions to ensure that the overall behavior of the system is not altered. Tests should be in place to verify that the functionality remains the same after the refactoring.

# Summary

This chapter focused on a variety of code refactoring techniques that are essential for maintaining and improving the structure, readability, and maintainability of your codebase. 

The refactoring techniques introduced include "Rename Variable," which enhances code clarity by using more descriptive variable names. "Extract Variable" simplifies complex expressions by breaking them into smaller, more manageable parts, and "Replace Loop with Pipeline" transforms traditional for/while loops into more concise, declarative higher-order functions like map, filter, and reduce.

"Extract Function" encourages code modularity and reusability by breaking down large functions into smaller ones, each with a single, well-defined responsibility. "Introduce Parameter Object" groups related parameters into a single object, thereby reducing the complexity of function signatures.

The "Decompose Conditional" refactoring technique breaks down complex conditional logic into separate functions, enhancing readability. "Moving Function" ensures that functions are placed in the most logical and appropriate location in your codebase, promoting high cohesion and loose coupling.

Throughout all these techniques, we emphasized the importance of maintaining the same overall system behavior and relying on tests to ensure that functionality remains consistent despite refactoring. These methods, when properly applied, can lead to a more understandable, easier to maintain, and more robust codebase.

In next chapter, we will explore an exceptional approach to enhance the quality of our code - the method known as Test-Driven Development.