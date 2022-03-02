## About The Project

- The Complete Node.js Developer Course (3rd Edition) on Udemy
- Tutorial for Task Manager App

## Installation

1. Install NPM packages

   ```sh
   npm install
   ```

2. From task-manager folder

   ```sh
   mkdir config
   touch ./config/dev.env
   ```

3. Enter the information in dev.env
   ```env
   PORT=3000
   API_KEY_SENDGRID=API Key from https://sendgrid.com/
   JWT_SECRET=some secret WORD
   MONGODB_URL=mongodb://localhost:27017/myapp
   ```
4. For Heroku users (https://devcenter.heroku.com/articles/config-vars)

   ```sh
   heroku create some-unique-app-name-ddmmmyy
   heroku config:set API_KEY_SENDGRID=value JWT_SECRET=value MONGODB_URL=value
   heroku config
   # Replace the respective values above.
   # e.g heroku config:set API_KEY_SENDGRID=afkw6426as2d JWT_SECRET=Hunter2 MONGODB_URL='someURLinQuotes'
   # heroku config should shows 3 keys.
   ```

## Notes

### Notes on Advanced Postman

- https://learning.postman.com/docs/sending-requests/managing-environments/
- Setup env in Postman so that copy and pasting token, etc... is not required.
- Wrote test scripts for POST Login User and POST Create User.

### Notes on testEnvironment

- https://jestjs.io/docs/configuration#testenvironment-string
- Default is `node` & Browser-like environment is `jsdom`.

```json
,
  "jest": {
    "testEnvironment": "jsdom"
  }
```

### Notes taken from Advanced Postman comment section:

> The majority of the apps you'll write as a programmer won't have a frontend or GUI. That Darksky API and Mapbox API we used earlier don't have frontends, they're just APIs as with our Task Manager API. The frontend is the easy part, you just send fetch requests to your backend as we did in the Weather app. Postman is used to simulate a client querying your API. You do send headers in the client, e.g:

```javascript
fetch('/users', {
  method: 'POST',
  headers: {
    Authorization: token,
  },
});
```

### Notes taken from Adding Images to User Profile comment section:

> Storing the avatars as Base64 binaries in the database is a very bad practice... A lesson on how to use external storage services would be preferable and more useful, or at the very least mentioning that this is only done for the purposes of the lesson and that for the final product you'd like to avoid it and save the files in the file system itself if the hosting allows it.

> <i>"Heroku limitation"</i>: It's a limitation of containers with respect to local storage.
> Local storage goes away every time the container is restarted. So if you save the avatar image in local storage, it won't be there when the container restarts. You can create a second container that is a storage claim, or you can store the image in object storage. Or you can keep things simple by using the included database as a permanent store for your images.
