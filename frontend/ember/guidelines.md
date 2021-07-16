# Naming conventions
- actions: for DDAU
  - inside component: `save`
  - component arguments (callback): `onSave`
  - inside controller: `save`

# Formatting
## Handlebars
- use "double quotes"

# Coding guidelines
## Handlebars
- Prefer `{{this.property}}` over `{{property}}` where both are possible.
- Prefer `{{#unless condition}}` over `{{#if (not condition)}}` for simple conditions.

## JavaScript
## Ember.js 🐹

- Model loading procedure:
  
  - `model()`: main model

  - `afterModel()`: secondary models

  - `setupController`: put secondary models on controller (main model is set automatically)

  ```
  // route: /example/detail
  model(params) {
    return this.store.findRecord('example', params.example_id);
  }
  async afterModel(model) {
    const [ modes, statusses ] = await Promise.all([
      this.store.findAll('publication-mode'),
      this.store.query('status', ...),
    ]);
    this.modes = modes;
    this.statusses = statusses;
  }
  setupController(controller) {
    super.setupController(...arguments);
    controller.modes = this.modes;
    controller.statusses = this.statusses;
  }
  ```
- Prefer simple data types as arguments to components
  
  *e.g.*
  - instead of `EmberData.RecordArray`: `Array`
  - instead of `Promise<Model>`: `Model`
  
  *Reason*: make components contained entities (don't require external knowledge)


- Make components responsible for loading of static data list (e.g. option list of `document-type`'s)
  
  In order to prevent multiple calls, the following strategy can be used:
  - load the list into the store in a parent route.

  - Use `peekAll` to prevent multiple calls

- Prefer modern syntax and Ember Octane
  ```
  const relatedModel = await model.relatedModel
  const otherRelatedModel = await relatedModel.otherRelatedModel
  // NOT: model.get('relatedModel.otherRelatedModel')
  ```
- Prefer booleans over string constant options as arguments
  ```
  @isReadMode={{true}}
  // NOT @mode="read"
  ```