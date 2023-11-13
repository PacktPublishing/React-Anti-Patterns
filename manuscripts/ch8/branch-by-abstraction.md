# Branch by abstraction

- getFeatureToggle from a remote server when loading the application
- define a function that says if some toggle is on, `isNewZealandMarketingEnabled`
- defien a new component to swith between the old and new
- toggling based on the value from the toggle

```tsx
type FancyComponentProps = {};

const FancyComponent = (props: FancyComponentProps) => {
    return isNewZealandMarketingEnabled() ? <NewFancyComponent {...props} /> : <OldNotTooFancyComponent {...props} />
}
```
