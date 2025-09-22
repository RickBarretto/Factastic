# Factastic

Dynamic Quiz platform powered by Open Trivia DB.


## Structure

This Project tries to keep its structure close to a Vertical Slice architecture,
so the file structure organization is by features.

See [Is there a recommended way to structure React projects?](https://legacy.reactjs.org/docs/faq-structure.html)
for more information.

Thus, I decided to put my services inside each feature and the same goes for styling,
keeping everythnig inside their own scope.

Here is how the project looks-like:

```
.
├── README.md
├── package.json              # Package dependency and task definitions
├── package-lock.json
├── .gitignore                # Keeps this repository clean on remote
├── LICENSE                   # BSD-3 License
├── index.html                # Entry of the page
├── src
│   ├── main.tsx
│   ├── App.tsx
│   ├── <lib>                 # Common components and functions
│   └── <features>            # Project organized by features
│       ├── <Component>.tsx   # Components and Pages
│       └── <services>        # Internal services, like external API communication
└── .github                   # Project settings, including Github Pages
```