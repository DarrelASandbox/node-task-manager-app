// CRUD Creat Read Update Delete Demo
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
    //     name: 'mongduck',
    //     age: 75102952424,
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
    //       age: 59175,
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

    // https://docs.mongodb.com/manual/reference/operator/update/
    // db.collection('users')
    //   .updateOne(
    //     { _id: new ObjectId('62187ff22c597d977e51148c') },
    //     {
    //       $set: {
    //         name: 'mongduck',
    //         age: 62049,
    //       },
    //     }
    //   )
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));

    // db.collection('users')
    //   .updateMany(
    //     {},
    //     {
    //       $inc: {
    //         age: 1,
    //       },
    //     }
    //   )
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));

    // db.collection('users')
    //   .deleteOne({ _id: new ObjectId('62187fdd3c4e93e9e6879ab4') })
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));

    // db.collection('users')
    //   .deleteMany({})
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));
  }
);
