// CRUD Creat Read Update Delete
import { MongoClient, ObjectId } from 'mongodb';

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// const id = new ObjectId();
// console.log(id);

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) return console.log(error, 'Unable to connect to database.');
    const db = client.db(databaseName);

    // https://docs.mongodb.com/manual/tutorial/insert-documents/
    // db.collection('users').insertOne(
    //   {
    //     name: 'God',
    //     age: 751029547102375,
    //   },
    //   (error, result) => {
    //     if (error) return console.log(error, 'Unable to insert user.');
    //     console.log(result.insertedId);
    //   }
    // );

    // db.collection('users').insertMany(
    //   [
    //     {
    //       name: 'mongcow',
    //       age: 93572,
    //     },
    //     {
    //       name: 'mongchick',
    //       age: 91759175,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) return console.log(error, 'Unable to insert user.');
    //     console.log(result.insertedIds);
    //   }
    // );

    // db.collection('users').findOne({ name: 'mongchick' }, (error, user) => {
    //   if (error || user === null)
    //     return console.log(error, 'Unable to get user data.');
    //   console.log(user);
    // });

    // db.collection('users')
    //   .find({
    //     name: 'God',
    //   })
    //   .toArray((error, user) => {
    //     if (error || user === null)
    //       return console.log(error, 'Unable to get user data.');
    //     console.log(user);
    //   });
  }
);
