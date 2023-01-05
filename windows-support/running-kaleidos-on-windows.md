# Running Kaleidos on Windows

```
DISCLAIMER:

The mu-semtech/mu-project stack (on which the app-kaleidos stack was built) was designed to run on a Linux machine,
containerized in Docker.

Running the stack on Windows requires special attention when coding and making sacrifices in terms of performance and convenience. It will run slower, and certain things might not work.

Windows is officially not supported. Which means that if you have issues that cannot be reproduced on Linux, you're on your own.

All the fixes described in this document are essentially a crutch to make sure the stack can be made to work on Windows.

The absolute best way to avoid all these issues is to simply switch to a Linux machine and all should be well.

If you do wish to continue down the rabbit hole, keep reading at your own risk...
```

# Requirements

You'll need a machine with plenty of RAM (at least 16GB is recommended), and a distriibution of **Windows Professional** with Hyper-V support and an installation of [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Do not attempt to run this on Windows Home. While it is technically possible to achieve using Virtualbox, it is such a hassle, and that much slower that the switch to Linux (e.g., via dual boot) is by far the better option.

Since you'll be using the command line a lot, it is also highly recommended to install a Linux bash emulator, such as [Cygwin](https://www.cygwin.com/).

# Cloning Git repositories with the right line endings

The first and foremost step to ensure that you can run - and perhaps modify - the project is to make sure you use the correct line endings.

The reason we need to do this is that git automatically converts line endings on checkout and add.
For most projects, this is desired behavior, but in the case of kaleidos (and any other project using the semantic.works stack), you're mounting these files on virtual Linux machines using Docker, and they don't like Windows line endings (CRLF) ...

Specifically, if you clone the repo as usual with

```
git clone git@github.com:kanselarij-vlaanderen/kaleidos-project.git
```

and run the stack as-is on Windows with Docker Desktop, you'll notice that if you go to http://localhost/mock-login , the database service will start complaining about 'unparseable queries'.
This is because the .ex files under config now have CRLF endings, which the authorization microservice doesn't understand.

The steps below describe what needs to be done to get the stack working on Windows, and fixes it for all future users as well.

First off, it is recommended to set `core.autocrlf = true` in your global git settings, so you are 100% sure to never commit any Windows CRLF line endings. To do this, execute in your command line (e.g., Git Bash):
```
git config --global core.autocrlf true
```

You could also just clone the repo with `--config core.autocrlf=input` as a parameter and be done with it.

```
git clone --config core.autocrlf=input git@github.com:kanselarij-vlaanderen/kaleidos-project.git
```

Then you'll check out LF endings, and any CRLF endings you type will be converted to LF on `git add`.

It is recommended to do this for every repository you clone, to avoid issues in the future.

To guarantee that other developers also check out the right line endings, we created a `.gitattributes` in the repository, with the following contents:

```
# Handle line endings automatically for files detected as text
# and leave all files detected as binary untouched.
# Set the default behavior, in case people don't have core.autocrlf set.
* text=auto

# Force the following filetypes to have unix eols, so Windows does not break them
*.* text eol=lf

# Denote all files that are truly binary and should not be modified. (bit overkill for this project, but better safe than sorry)
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.mov binary
*.mp4 binary
*.mp3 binary
*.flv binary
*.fla binary
*.swf binary
*.gz binary
*.zip binary
*.7z binary
*.ttf binary
*.eot binary
*.woff binary
*.pyc binary
*.pdf binary
*.ez binary
*.bz2 binary
*.swp binary
```

It is recommended to add this to every new repository you create in the stack as well.

Finally, you can add an .editorconfig file to the root of your project, which will be read by your editor if you have the right plugin: https://editorconfig.org/. This file has the following contents:

```
root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true

[*.{diff,md}]
trim_trailing_whitespace = false
```

It's highly recommended to install this, as it will keep your code consistent while you're editing. In this case, it will also make sure you're adding LF line endings, which docker will like.

# Running the stack

If all steps concerning line endings were followed correctly, you should now be able to run the stack as-is without any problems by executing `docker-compose up -d` (with all the right `.env` variables and overrides set of course).

As explained in the [project README](https://github.com/kanselarij-vlaanderen/app-kaleidos#kaleidos), make sure the following environment variables are set (e.g., in .env):
```
COMPOSE_FILE=docker-compose.yml;docker-compose.development.yml;docker-compose.override.yml
```

and that the `docker-compose.override.yml` file exists and disables the services you won't need to run locally:

```
search:
  entrypoint: "echo 'service disabled'"
tika:
  entrypoint: "echo 'service disabled'"
elasticsearch:
  entrypoint: "echo 'service disabled'"
yggdrasil:
  entrypoint: "echo 'service disabled'"
```

To have some data available when you run the stack locally, unzip the 3 directories in the `testdata` folder in `testdata.zip` to the `data` folder in your project.

When Docker Compose has finished pulling all images (this could take a while), the application should now be accessible in your browser at http://localhost/mock-login

# Adding microservices with code reload

A major annoyance for developers on Windows in this application stack is the lack of support of docker-compose for code change detection. This means that without adjustment, developers need to manually restart their microservice every time they make a change in the code.

On Linux, this hassle is avoided, since docker-compose does support live code reload there, and makes the whole process a lot more enjoyable.

However, there is a workaround to enable automatic restart of services on code changes on Windows, at least for the [mu-javascript-template](https://github.com/mu-semtech/mu-javascript-template).

To add a new JavaScript service, create your application as usual starting from the template, using Docker or by manually creating an `app.js`, `Dockerfile`, etc. (For convenience, a skeleton service is available as a starting point [here](https://github.com/tdn/skeleton-mu-javascript-service)). Don't forget the lessons learned from the line endings section of this document, so make sure to add a `.gitattributes` and `.editorconfig` file, and to set `core.autocrlf=input` correctly.

Once you have a service to run, the usual way to add it to the stack would be to include it in `docker-compose.override.yml` like this:

```
my-service:
  image: semtech/mu-javascript-template
  ports:
    - 8882:80
  environment:
    NODE_ENV: "development"
  links:
    - triplestore:database
  volumes:
    - /path/to/your/code/directory/:/app/
    - /path/to/your/data/directory/:/data/
```
(obviously change the volume paths to something real)

This will also work on Windows, however without the ability to reload the service automatically when any code changes.

To change that, you can locally build a special version of the `semtech/mu-javascript-template` with a `:windows` tag, which does support a limited version of code reload using `--legacy-watch`, which is not as good as the newer version, but at least makes coding less of a hassle.

To do this, clone the following fork of the [mu-javascript-template repository](https://github.com/mu-semtech/mu-javascript-template): https://github.com/tdn/mu-javascript-template and checkout the `fix/windows-dev-fixes` branch as follows:

```
git checkout fix/windows-dev-fixes
```

Then build the Docker image using the following command

```
docker build -t semtech/mu-javascript-template:windows .
```

Once this is done, you should see two `semtech/mu-javascript-template` images in the `Images` tab of your Docker Desktop application: one with the tag `latest` and one with the tag `windows`.

Then you change your `docker-compose.override.yml` to the following:

```
skeleton-service:
  image: semtech/mu-javascript-template:windows #only for windows users
  ports:
    - 8882:80
  environment:
    NODE_ENV: "development"
    DEV_OS: "windows" #only for windows users
  links:
    - triplestore:database
  volumes:
    - /path/to/your/code/directory/:/app/
    - /path/to/your/data/directory/:/data/
```

Now, whenever a code file (.js, .json, ...) changes in `/path/to/your/code/directory/`, it will be detected and reloaded into the container's `/app/` directory, and the service will restart.

Note that every time the original [mu-javascript-template repository](https://github.com/mu-semtech/mu-javascript-template) is updated, these changes first need to be synched to the [forked repository](https://github.com/tdn/mu-javascript-template) and the [fix/windows-dev-fixes branch](https://github.com/tdn/mu-javascript-template/tree/fix/windows-dev-fixes). Then you'll need to manually rebuild this image again to get all the latest updates.

Again, this shows why all of this is a suboptimal solution, and the best thing to do would be to run your development setup on Linux.
