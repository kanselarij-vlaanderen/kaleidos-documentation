# Lint
## Ember Handlebars
- doc [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint)
  
- [(temporarily) disabling](https://github.com/ember-template-lint/ember-template-lint/blob/4b9805388c79df1fe326c9685e15d543b57aa667/docs/configuration.md)

  ```
  {{!-- template-lint-disable no-triple-curlies  --}}
  ```

- expected formatting of long and nested function calls:
  ```
      {{#if
        (and
          this.currentSession.isEditor
          this.model.pieces.length
          (not this.isEnabledPieceEdit)
        )
      }}
  ```

## JavaScript
## ES Lint
- see [es-lint](https://eslint.org/)

- (temporarily) disabling

  ```
  /* eslint-disable */
  ```

# When using Visual Studio Code
## Extensions
- ESLint plugin
    Mark incorrectly JavaScript formatting
- EditorConfig for VS Code
    Force formatting prescribed in .editorconfig-file

I couldn't make Ember extension pack work

## Debugging

### Chrome
add file: .vscode/launch.json
```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "frontend-kaleidos/*": "${workspaceFolder}/app/*"
      }
    }
  ]
}
```
Sometimes, after having `npm start` running for a while, sourcemaps become incorrect. Rerun `npm start` to fix it.

### Firefox
I couldn't make it work.