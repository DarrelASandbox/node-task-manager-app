Advanced Postman Video from The Complete Node.js Developer Course (3rd Edition)

https://learning.postman.com/docs/sending-requests/managing-environments/

- Setup env in Postman so that copy and pasting token, etc... is not required.
- Wrote test scripts for POST Login User and POST Create User.

The majority of the apps you'll write as a programmer won't have a frontend or GUI.
That Darksky API and Mapbox API we used earlier don't have frontends, they're just APIs as with our Task Manager API.
The frontend is the easy part, you just send fetch requests to your backend as we did in the Weather app.
Postman is used to simulate a client querying your API. You do send headers in the client, e.g:

```javascript
fetch('/users', {
  method: 'POST',
  headers: {
    Authorization: token,
  },
});
```
