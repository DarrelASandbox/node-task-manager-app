## About The Project

- The Complete Node.js Developer Course (3rd Edition) on Udemy
- Tutorial for Task Manager App

## Installation

1. Install NPM packages

   ```sh
   npm install
   ```

### Notes taken from the comment section:

> Storing the avatars as Base64 binaries in the database is a very bad practice... A lesson on how to use external storage services would be preferable and more useful, or at the very least mentioning that this is only done for the purposes of the lesson and that for the final product you'd like to avoid it and save the files in the file system itself if the hosting allows it.

> <i>"Heroku limitation"</i>: It's a limitation of containers with respect to local storage.
> Local storage goes away every time the container is restarted. So if you save the avatar image in local storage, it won't be there when the container restarts. You can create a second container that is a storage claim, or you can store the image in object storage. Or you can keep things simple by using the included database as a permanent store for your images.
