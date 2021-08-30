- Update properties bound to query params with `set(...)`
  ```
  queryParams = {
    sort: {
      as: sorteer
    }
  }
  ...
  set(this, 'sort', 'created-on')
  ```
  *Reason*: workaround for performance bug in Ember <3.20.6 [see issue](https://github.com/emberjs/ember.js/issues/18715)

- Use `set(...)` in `setupController` for non-`@tracked` properties (and properties bound to query params)