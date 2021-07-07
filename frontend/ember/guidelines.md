# Naming conventions
- actions: for DDAU
  - inside component: `onSave`
  - inside controller like `save`

# Coding guidelines
## Handlebars
- Prefer `{{this.property}}` over `{{property}}` where both are possible.
- Prefer `{{#unless condition}}` over `{{#if (not condition)}}` for simple conditions.

## JavaScript
- Prefer simple data types as arguments to components
  
  *e.g.*
  - instead of `EmberData.RecordArray`: `Array`
  - instead of `Promise<Model>`: `Model`
  
  *Reason*: make components contained entities (don't require external knowledge)

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

- Make components responsible for loading of static data list (e.g. option list of `document-type`'s)
  
  - Load the list into the store in a parent route

  - Use `peekAll` to prevent multiple calls

- Prefer modern syntax
  ```
  // NOT: model.get('relatedModel.otherRelatedModel')
  const relatedModel = await model.relatedModel
  const otherRelatedModel = await relatedModel.otherRelatedModel
  ```