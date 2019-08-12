# trainTimeTable

### What is it?

This is a simple website that utilizes a FireBase database on the backend to store and return records of different trains. 

Every minute the database updates (without a page refresh required) and reflects how many minutes there are until any given train's next arrival.

Below the table displaying the records currently in the database is a form for users who would like to add their own train records to the database for tracking purposes.

There are two thresholds of warning to the user to indicate when a train is about to arrive/depart:

* When a train is 15 minutes or fewer away a visual warning is triggered (the "minutes to arrival" value turns red);
* When a train is 5 minutes or fewer the entire train record turns red until the train has departed.




